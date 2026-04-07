const ort = require('onnxruntime-node');
const path = require('path');
const fs = require('fs');

const MODEL_PATH = path.join(__dirname, 'all_minilm_l6_v2.onnx');
let sessionPromise;
let tokenizerPromise;

async function getTokenizer() {
    const transformers = await import('@xenova/transformers');
    return transformers.AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2');
}

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
        tokenizerPromise = getTokenizer();
    }

    const session = await sessionPromise;

  // Tokenize sentence
    const tokenizer = await tokenizerPromise;
    const encoded = await tokenizer(sentence);

    // @xenova/transformers returns Tensor objects — extract raw data and shape.
    const inputIdsData = Array.from(encoded.input_ids.data);
    const attentionMaskData = Array.from(encoded.attention_mask.data);
    const seqLen = encoded.input_ids.dims[1];

    // Prepare ONNX input
    const input_ids = new ort.Tensor('int64', BigInt64Array.from(inputIdsData.map((x) => BigInt(x))), [1, seqLen]);
    const attention_mask = new ort.Tensor('int64', BigInt64Array.from(attentionMaskData.map((x) => BigInt(x))), [1, seqLen]);

    const results = await session.run({ input_ids, attention_mask });
    const embedding = results.pooler_output.data; // 384-dim sentence embedding
    return embedding;
}

module.exports = {
    preprocessQuery,
    preprocessQueries,
    embedSentence
};