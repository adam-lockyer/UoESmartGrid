const express = require("express");
const router = express.Router();
const embedder = require("../MASQuery/embedder");
const nlqQuerier = require("../MASQuery/naturalLanguageQuery");

router.get("/", async (req, res) => {
	try {
		const sentence = req.query.sentence;
		if (!sentence) {
			return res.status(400).json({ errors: [{ msg: "sentence is required" }] });
		}

        const sentencePreprocessed = embedder.preprocessQuery(sentence);
        const vector = await embedder.embedSentence(sentencePreprocessed);
        const result = await nlqQuerier.queryNLQ(vector);

		if (result?.kind === "fileSaved") {
			return res.status(result.status || 200).json(result.data);
		}

		if (result?.kind === "json") {
			return res.status(result.status || 200).json(result.data);
		}

		if (result?.kind === "text") {
			return res.status(result.status || 200).send(result.data);
		}

		return res.json(result);
	} catch (e) {
		if (e.isAxiosError && e.response) {
			const upstreamStatus = e.response.status;
			const upstreamBody = Buffer.isBuffer(e.response.data)
				? e.response.data.toString("utf8")
				: String(e.response.data ?? "");
			console.error(`Upstream NLQ error ${upstreamStatus}: ${upstreamBody}`);
			return res
				.status(502)
				.json({ errors: [{ msg: `Upstream error ${upstreamStatus}: ${upstreamBody}` }] });
		}

		console.error(e);
		return res
			.status(500)
			.json({ errors: [{ msg: "An unexpected error occurred" }] });
	}
});

module.exports = router;