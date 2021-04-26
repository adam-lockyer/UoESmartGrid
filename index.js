const express = require("express");
const app = express();
const cors = require("cors");

// Init Middleware
app.use(express.json({ extend: false }));
// Enable CORS
app.use(cors());

const Influx = require("influx");
const influx = new Influx.InfluxDB({
	host: "localhost",
	port: 8086,
	protocol: "http",
	database: "SmartGrid",
});

// Define Routes
app.use("/api/forecast", require("./routes/forecast"));
app.use("/api/consumption", require("./routes/consumption"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server Listening on Port ${PORT}`);
});
