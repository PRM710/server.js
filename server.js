const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

// ✅ Fix CORS Issue
const allowedOrigins = [
  "https://advoice-online-neon.vercel.app",
  "http://localhost:5173"
];


app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: "GET, POST, PUT, DELETE, OPTIONS",
        allowedHeaders: "Content-Type, Authorization",
        credentials: true
    })
);

// ✅ Ensure CORS Headers Are Sent in Every Response
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

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
            console.log("✅ Fetched Data:", JSON.stringify(keys, null, 2));
        }
    } catch (error) {
        console.error("❌ Error fetching data:", error);
    }
}

// ✅ API to Fetch Data via HTTP
app.get("/get-keys", async (req, res) => {
    try {
        const { assignedTo, licenseKey } = req.query; // Get user input from frontend

        if (!assignedTo || !licenseKey) {
            return res.status(400).json({ error: "Missing assignedTo or licenseKey parameter" });
        }

        const user = await AccessKey.findOne({ assignedTo, licenseKey }, { _id: 0, assignedTo: 1, licenseKey: 1 });

        if (!user) {
            return res.status(404).json({ error: "Invalid credentials" });
        }

        res.json(user);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error", details: error.message });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
