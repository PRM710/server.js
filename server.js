import mongoose from "mongoose";
import Cors from "cors";

// CORS Configuration
const cors = Cors({
    origin: ["http://localhost:5173", "https://advoice-online-2k4d7gi0i-prakash-a2b1c29c.vercel.app/"],
    methods: ["GET", "HEAD"]
});

// MongoDB Connection (Only connect once)
const mongoURI = "mongodb+srv://prakashprm710:ZbrCvUh8uDwDbdEm@cluster0.aovl7.mongodb.net/advoice?retryWrites=true&w=majority&appName=Cluster0";

let connection;
if (!global._mongoClientPromise) {
    global._mongoClientPromise = mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}
async function getDBConnection() {
    if (!connection) {
        connection = await global._mongoClientPromise;
    }
    return connection;
}

// Define Schema
const accessKeySchema = new mongoose.Schema({
    assignedTo: String,
    licenseKey: String
});

const AccessKey = mongoose.models.AccessKey || mongoose.model("AccessKey", accessKeySchema, "access_keys");

// API function for Vercel
export default async function handler(req, res) {
    await getDBConnection(); // Ensure DB connection before queries
    await new Promise((resolve) => cors(req, res, resolve)); // Apply CORS middleware

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { assignedTo } = req.query;
    if (!assignedTo) {
        return res.status(400).json({ error: "Missing assignedTo parameter" });
    }

    try {
        const userKey = await AccessKey.findOne({ assignedTo }, { assignedTo: 1, licenseKey: 1, _id: 0 });

        if (!userKey) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(userKey);
    } catch (error) {
        res.status(500).json({ error: "Database error", details: error.message });
    }
}
