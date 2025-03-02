import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000; // Use Render-assigned port

// Enable CORS
const corsOptions = {
    origin: ["http://localhost:5173", "https://advoice-online-livid.vercel.app/login.html"], 
    methods: ["GET", "HEAD"]
};
app.use(cors(corsOptions));

// MongoDB Connection
const mongoURI = "mongodb+srv://prakashprm710:ZbrCvUh8uDwDbdEm@cluster0.aovl7.mongodb.net/advoice?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Define Schema
const accessKeySchema = new mongoose.Schema({
    assignedTo: String,
    licenseKey: String
});

const AccessKey = mongoose.model("AccessKey", accessKeySchema, "access_keys");

// API Endpoint
app.get("/api/get-keys", async (req, res) => {
    try {
        const { assignedTo } = req.query;
        if (!assignedTo) {
            return res.status(400).json({ error: "Missing assignedTo parameter" });
        }

        const userKey = await AccessKey.findOne({ assignedTo }, { assignedTo: 1, licenseKey: 1, _id: 0 });

        if (!userKey) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(userKey);
    } catch (error) {
        res.status(500).json({ error: "Database error", details: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
