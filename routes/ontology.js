const express = require("express");
const router = express.Router();
const config = require("config");
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { join } = require('path');
const rdf = require('rdflib');

const URI = "http://www.semanticweb.org/al657/ontologies/2024/1/CREWW_Ontology_v6";
const ontologyData = fs.readFileSync('./ontology/CREWW_Ontology_v9.rdf').toString();
const store = rdf.graph();
rdf.parse(ontologyData, store, URI, 'application/rdf+xml')
const RDF_Namespace = rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
const brick = rdf.Namespace("https://brickschema.org/schema/Brick#")
const owl = rdf.Namespace("http://www.w3_org/2002/07/owl#")
const CREWW = rdf.Namespace("http://www.semanticweb.org/al657/ontologies/2024/1/CREWW_Ontology_v6#")
const bot = rdf.Namespace("https://w3id.org/bot#")

// /api/ontology/custom
router.get("/custom", async (req, res, next) => {
    const queryString = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX Brick: <https://brickschema.org/schema/Brick#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX CREWW: <http://www.semanticweb.org/al657/ontologies/2024/1/CREWW_Ontology_v6#>
        SELECT ?sensor  
        WHERE {
        ?sensor rdf:type CREWW:viewSensors .
        }
        `

    await fs.promises.appendFile(
        join('./ontology/scripts/args.json'),
        JSON.stringify({ queryString }),
        {
            encoding: 'utf-8',
            flag: 'w',
        },
    );

    const pythonProcess = await spawnSync('./ontology/scripts/env/Scripts/python.exe', [
        './ontology/scripts/rdflibtest.py',
        'queryRDF',
        './ontology/scripts/args.json',
        './ontology/scripts/results.json'
    ]);

    const result = pythonProcess.stdout?.toString()?.trim();
    console.log("after result", result)
    const error = pythonProcess.stderr?.toString()?.trim();

    const status = result === 'OK';
    console.log("after status", status)

    if (status) {
        try {
            const buffer = await fs.promises.readFile('./ontology/scripts/results.json');
            const resultParsed = JSON.parse(buffer?.toString());
            return res.status(200).send(resultParsed)
        } catch (error) {
            console.log("JSON File reading error:", error)
            return res.send(JSON.stringify({ status: 500, message: 'Server error' }))
        }
      } else {
        console.log("Pyhton script error: ", error)
        return res.send(JSON.stringify({ status: 500, message: 'Server error' }))
    }
});


// /api/ontology/sensors
router.get('/sensors', (req, res) => {
    try {
        const sensorData = store.statementsMatching(null, RDF_Namespace('type'), CREWW('viewSensors'), null)

        const parsedSensors = sensorData.map((datum) => datum.subject.toString().split('#')[1].slice(0, -1));
        return res.status(200).json({ sensors: parsedSensors});
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
})

// /api/ontology/devices
router.get('/devices', (req, res) => {
    try {
        const deviceData = store.statementsMatching(null, RDF_Namespace('type'), CREWW('viewDevices'), null)

        const parsedDevices = deviceData.map((datum) => datum.subject.toString().split('#')[1].slice(0, -1));
        return res.status(200).json({ devices: parsedDevices});
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
})

module.exports = router;

// /api/ontology/floors
router.get('/floors', (req, res) => {
    try {
        const floorData = store.statementsMatching(CREWW('CREWW'), bot('hasStorey'), null, null)

        const parsedFloors = floorData.map((datum) => datum.object.toString().split('#')[1].slice(0, -1));
        return res.status(200).json({ floors: parsedFloors});
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
})

module.exports = router;

// /api/ontology/rooms
router.get('/rooms', (req, res) => {
    try {
        const floor  = req.query.floor;

        if (!floor) {
            return res.status(400).send('Floor parameter is required');
        }

        const roomData = store.statementsMatching(CREWW(floor), bot('hasSpace'), null, null)
        const parsedRooms = roomData.map((datum) => datum.object.toString().split('#')[1].slice(0, -1));
        return res.status(200).json({ rooms: parsedRooms});
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
})

module.exports = router;