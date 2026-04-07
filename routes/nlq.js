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

        return res.json(result);
	} catch (e) {
		console.log(e);
		return res
		.status(500)
		.json({ errors: [{ msg: "An unexpected error occurred" }] });
	}
});

module.exports = router;