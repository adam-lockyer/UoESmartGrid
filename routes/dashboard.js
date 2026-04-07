const express = require("express");
const router = express.Router();
const querier = require("../MASQuery/dashboardQuery");

router.post("/dashboard", async (req, res) => {
    try {
        querier.useDashboard({
            toPass: req.body.action,
            onComplete: (data) => {
                return res.json(data);
            },
        });
    } catch (e) {
        console.log(e);
        return res
        .status(500)
        .json({ errors: [{ msg: "An unexpected error occurred" }] });
    }
});

router.post("/ontology", async (req, res) => {
    try {
        querier.useOntology({
            toPass: req.body.action,
            onComplete: (data) => {
                return res.json(data);
            },
        });
    } catch (e) {
        console.log(e);
        return res
        .status(500)
        .json({ errors: [{ msg: "An unexpected error occurred" }] });
    }
});

module.exports = router;