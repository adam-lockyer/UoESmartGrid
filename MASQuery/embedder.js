const ort = require('onnxruntime-node');
const path = require('path');
const fs = require('fs');

const MODEL_PATH = path.join(__dirname, 'all_minilm_l6_v2.onnx');
const L2_NORMALIZE_EMBEDDING = (process.env.NLQ_L2_NORMALIZE_EMBEDDING || 'false').toLowerCase() === 'true';
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

function l2Normalize(vector) {
    let sumSquares = 0;
    for (let i = 0; i < vector.length; i++) {
        sumSquares += vector[i] * vector[i];
    }

    const norm = Math.sqrt(sumSquares);
    if (!Number.isFinite(norm) || norm === 0) {
        return vector;
    }

    for (let i = 0; i < vector.length; i++) {
        vector[i] /= norm;
    }

    return vector;
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

    // @xenova/transformers returns Tensor objects; extract raw data and shape.
    const inputIdsData = Array.from(encoded.input_ids.data);
    const attentionMaskData = Array.from(encoded.attention_mask.data);
    const seqLen = encoded.input_ids.dims[1];

    // Prepare ONNX input
    const input_ids = new ort.Tensor('int64', BigInt64Array.from(inputIdsData.map((x) => BigInt(x))), [1, seqLen]);
    const attention_mask = new ort.Tensor('int64', BigInt64Array.from(attentionMaskData.map((x) => BigInt(x))), [1, seqLen]);

    const results = await session.run({ input_ids, attention_mask });
    const lastHiddenState = results.last_hidden_state;

    if (!lastHiddenState || !lastHiddenState.data || !lastHiddenState.dims) {
        throw new Error('Model output missing last_hidden_state.');
    }

    const [batchSize, outputSeqLen, hiddenSize] = lastHiddenState.dims;
    if (batchSize !== 1) {
        throw new Error(`Expected batch size 1, got ${batchSize}.`);
    }
    if (outputSeqLen !== seqLen) {
        throw new Error(`Token length mismatch between tokenizer (${seqLen}) and model output (${outputSeqLen}).`);
    }

    // Mean-pool token embeddings using attention mask to ignore padded tokens.
    const pooled = new Float32Array(hiddenSize);
    let validTokenCount = 0;

    for (let tokenIndex = 0; tokenIndex < outputSeqLen; tokenIndex++) {
        if (!attentionMaskData[tokenIndex]) {
            continue;
        }

        validTokenCount += 1;
        const tokenOffset = tokenIndex * hiddenSize;
        for (let featureIndex = 0; featureIndex < hiddenSize; featureIndex++) {
            pooled[featureIndex] += lastHiddenState.data[tokenOffset + featureIndex];
        }
    }

    if (validTokenCount === 0) {
        throw new Error('Attention mask produced zero valid tokens for mean pooling.');
    }

    for (let featureIndex = 0; featureIndex < hiddenSize; featureIndex++) {
        pooled[featureIndex] /= validTokenCount;
    }

    if (L2_NORMALIZE_EMBEDDING) {
        l2Normalize(pooled);
    }

    return pooled;
}

module.exports = {
    preprocessQuery,
    preprocessQueries,
    embedSentence
};