const express = require("express");
const router = express.Router();
const config = require("config");
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { join } = require('path');

// const client = connectDB();
// const database = client.db("CREWW_All");

// /api/mongoPull/sensor
router.get('/mongoPull/sensor', (req, res) => {
    try {
        const mongoID = req.query.toPass;

        if (!mongoID) {
            return res.status(400).send('Mongo ID for required sensor point must be sent');
        }

    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
})


module.exports = router;