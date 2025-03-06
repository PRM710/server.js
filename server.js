const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

// Fix CORS Configuration
app.use(
    cors({
        origin: "http://localhost:5173", // Allow only your frontend
        methods: "GET,POST,PUT,DELETE",
        credentials: true // Allow credentials like cookies & authentication headers
    })
);

mongoose.connect("mongodb+srv://prakashprm710:ZbrCvUh8uDwDbdEm@cluster0.aovl7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Schema
const accessKeySchema = new mongoose.Schema({
    assignedTo: { type: String, required: true },
    licenseKey: { type: String, required: true }
});

const AccessKey = mongoose.model("AccessKey", accessKeySchema, "access_keys");

// API Endpoint to Fetch licenseKey & assignedTo
app.get("/get-keys", async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Set specific frontend origin
        res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials

        const keys = await AccessKey.find({}, { assignedTo: 1, licenseKey: 1, _id: 0 });
        res.json(keys);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
