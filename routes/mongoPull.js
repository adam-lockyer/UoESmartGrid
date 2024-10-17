const express = require("express");
const router = express.Router();
const config = require("config");
const path = require('path');
const connectDB = require("../lib/mongo");

const client = connectDB();
let database = client.db("CREWW_All");

// /api/mongoPull/sensor
router.get('/sensor', async (req, res) => {
    try {
        const mongoID = req.query.toPass;

        if (!mongoID) {
            return res.status(400).send('Mongo ID for required sensor point must be sent');
        }
        const sensorCollection = database.collection(mongoID);
        const data = await sensorCollection.find({}, { projection: {_id:0, datetime:1, value:1}}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
          });;
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
})


module.exports = router;