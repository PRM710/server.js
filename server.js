const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://prakashprm710:ZbrCvUh8uDwDbdEm@cluster0.aovl7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const accessKeySchema = new mongoose.Schema({
    assignedTo: String,
    licenseKey: String
});

const AccessKey = mongoose.model("AccessKey", accessKeySchema, "access_keys");

// API Endpoint to Fetch licenseKey & assignedTo
app.get("/get-keys", async (req, res) => {
    try {
        const keys = await AccessKey.find({}, { assignedTo: 1, licenseKey: 1, _id: 0 });
        res.json(keys);
    } catch (error) {
        res.status(500).json({ error: "Database error", details: error.message });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
