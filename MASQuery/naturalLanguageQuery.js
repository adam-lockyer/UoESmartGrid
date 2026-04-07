const axios = require("axios");
const { request } = require("express");

const DEFAULT_NLQ_ENDPOINT = process.env.MAS_NLQ_URL || "http://localhost:8080/api/nlq/query";

async function queryNLQ(sentence, vector) {
    const response = await axios.post(
        DEFAULT_NLQ_ENDPOINT,
        {
            request: "query",
            data: Array.from(vector),
        },
        {
            headers: { "Content-Type": "application/json" },
            timeout: 15000,
        }
    );

    return response.data;
}

module.exports = {
    queryNLQ,
};