const ort = require('onnxruntime-node');
const path = require('path');
const fs = require('fs');
const { AutoTokenizer } = require('@xenova/transformers'); // Optional JS tokenizer

const MODEL_PATH = path.join(__dirname, 'all_minilm_l6_v2.onnx');
let sessionPromise;
let tokenizerPromise;

function preprocessQuery(query) {

    let processed = query.toLowerCase().trim();
    processed = processed.replace(/\s+/g, ' ');
    processed = processed.replace(/[^\w\s\-._()]/g, '');
    processed = processed.trim();
    
    return processed;
}

function preprocessQueries(queries) {
    return queries.map(query => preprocessQuery(query));
}

async function embedSentence(sentence) {
    if (!fs.existsSync(MODEL_PATH)) {
        throw new Error(`ONNX model not found at ${MODEL_PATH}`);
    }

    // Cache model and tokenizer to avoid reloading them on every request.
    if (!sessionPromise) {
        sessionPromise = ort.InferenceSession.create(MODEL_PATH);
    }
    if (!tokenizerPromise) {
        tokenizerPromise = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2');
    }

    const session = await sessionPromise;

  // Tokenize sentence
    const tokenizer = await tokenizerPromise;
    const encoded = await tokenizer(sentence);

    let inputIds = encoded.input_ids;
    let attentionMask = encoded.attention_mask;

    if (Array.isArray(inputIds) && Array.isArray(inputIds[0])) {
        inputIds = inputIds[0];
    }
    if (Array.isArray(attentionMask) && Array.isArray(attentionMask[0])) {
        attentionMask = attentionMask[0];
    }

    if (!Array.isArray(inputIds)) {
        throw new Error("Tokenizer did not return input_ids as an array");
    }
    if (!Array.isArray(attentionMask)) {
        attentionMask = new Array(inputIds.length).fill(1);
    }

  // Prepare ONNX input
  const input_ids = new ort.Tensor('int64', BigInt64Array.from(inputIds.map((x) => BigInt(x))), [1, inputIds.length]);
  const attention_mask = new ort.Tensor('int64', BigInt64Array.from(attentionMask.map((x) => BigInt(x))), [1, attentionMask.length]);

  const results = await session.run({ input_ids, attention_mask });
  const embedding = results.pooler_output.data; // 384-dim sentence embedding
  return embedding;
}

module.exports = {
    preprocessQuery,
    preprocessQueries,
    embedSentence
};