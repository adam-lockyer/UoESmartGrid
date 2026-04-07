const express = require("express");
const router = express.Router();
const embedder = require("../MASQuery/embedder");

router.get("/", async (req, res) => {
	try {
		const sentence = req.query.sentence;
		if (!sentence) {
			return res.status(400).json({ errors: [{ msg: "sentence is required" }] });
		}

        const sentencePreprocessed = embedder.preprocessQuery(sentence);
        const vector = await embedder.embedSentence(sentencePreprocessed);

        return res.json({
			results: Array.from(vector),
        });
	} catch (e) {
		console.log(e);
		return res
		.status(500)
		.json({ errors: [{ msg: "An unexpected error occurred" }] });
	}
});

module.exports = router;