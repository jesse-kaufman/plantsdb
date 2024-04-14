// Server

// Enviroment variables
require("dotenv").config();

// MongoDB connection
const { connectDB } = require("./utils/db");
connectDB();

// Setup Express
const express = require("express");
const app = express();

// Enable compression
const compression = require("compression");
app.use(compression());

// Interpret responses as JSON
app.use(express.json());

// Only parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Use CORS
const cors = require("cors");
app.use(cors());

// User routes
const plantRoutes = require("./routes/plantRoutes");
app.use("/api/v1/plants", plantRoutes);

// Start the server
const server = app.listen(8420, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
