const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

// ✅ Fix CORS
const allowedOrigins = ["https://online-advoice.vercel.app"];
app.use(
    cors({
        origin: allowedOrigins,
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    })
);

// ✅ Connect to MongoDB (`advoice` Database)
mongoose
    .connect("mongodb+srv://prakashprm710:ZbrCvUh8uDwDbdEm@cluster0.aovl7.mongodb.net/advoice?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("✅ MongoDB connected to 'advoice' database");
        fetchAndLogData(); // Fetch & Log data in terminal on startup
    })
    .catch(err => console.error("❌ MongoDB connection error:", err));

mongoose.connection.on("error", err => {
    console.error("❌ MongoDB Error:", err);
});

// ✅ Define Schema (Fetch All Fields)
const accessKeySchema = new mongoose.Schema({}, { strict: false });
const AccessKey = mongoose.model("AccessKey", accessKeySchema, "access_keys");

// ✅ Function to Fetch & Log Data on Startup
async function fetchAndLogData() {
    try {
        console.log("📡 Fetching all data from 'advoice.access_keys'...");

        const keys = await AccessKey.find({});
        
        if (!keys.length) {
            console.warn("⚠️ No data found in 'access_keys' collection.");
        } else {
            console.log("✅ Fetched Data:", JSON.stringify(keys, null, 2)); // Logs data in readable format
        }
    } catch (error) {
        console.error("❌ Error fetching data:", error);
    }
}

// ✅ API to Fetch Data via HTTP
app.get("/get-keys", async (req, res) => {
    try {
        console.log("📡 Fetching data via API request...");

        const keys = await AccessKey.find({});
        
        console.log("✅ API Response:", JSON.stringify(keys, null, 2));
        res.json(keys);
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
