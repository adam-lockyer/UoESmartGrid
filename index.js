const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

// Init Middleware
app.use(express.json({ extend: false }));
// Enable CORS
app.use(cors());

const Influx = require("influx");
const connectDB = require("./lib/mongo");

const influx = new Influx.InfluxDB({
	host: "localhost",
	port: 8086,
	protocol: "http",
	database: "SmartGrid",
});

// Define static files in the client
app.use(express.static(path.join(__dirname, "../app/client/build")));
// Define Routes
app.use("/api/forecast", require("./routes/forecast"));
app.use("/api/consumption", require("./routes/consumption"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/auth", require("./routes/auth"));
// Serve client on all non-api routes
app.get("*", (req, res) => {
	return res.sendFile(path.join(__dirname, "../app/client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.info(`Server Listening on Port ${PORT}`);
});
