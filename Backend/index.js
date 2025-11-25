// index.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const ConnectDb = require("./config/db");
const Notes = require("./models/notes");
const VisitorData = require("./models/VisitorsData");
const trackVisitor = require("./middleware/trackVisitor");
const protect = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoute");

const app = express();

// ==========================
// Middleware
// ==========================
app.use(cors());
app.use(express.json());
app.set("trust proxy", true); // ensures correct IPs behind reverse proxies

// ==========================
// Connect to DB
// ==========================
ConnectDb();

// ==========================
// ROUTES
// ==========================

//  Home (only place that tracks visitor hits)
app.get("/", trackVisitor, (req, res) => {
  res.send("🏡 Welcome! Visitor tracked successfully.");
});

//  Auth routes (login attempts also tracked)
app.use("/auth", authRoutes);

//  Protected Notes routes
app.post("/post", protect, async (req, res) => {
  try {
    const { message, toPerson } = req.body;
    if (!message || !toPerson) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const note = await Notes.create({ message, toPerson });
    return res.status(201).json({ success: true, message: "Note added.", data: note });
  } catch (err) {
    console.error("❌ Error creating note:", err.message);
    return res.status(500).json({ success: false, message: "Failed to create note." });
  }
});

app.get("/notes", protect, async (req, res) => {
  try {
    const notes = await Notes.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: notes.length, data: notes });
  } catch (err) {
    console.error("❌ Error fetching notes:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch notes." });
  }
});

//  Visitor Analytics
app.get("/visitors", async (req, res) => {
  try {
    const visitors = await VisitorData.find().sort({ time: -1 });
    return res.json({ success: true, count: visitors.length, data: visitors });
  } catch (err) {
    console.error("❌ Error fetching visitors:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch visitors." });
  }
});

app.delete("/visitors", async (req, res) => {
  try {
    await VisitorData.deleteMany({});
    console.log("🧹 All visitor data deleted.");
    return res.json({ success: true, message: "All visitors deleted." });
  } catch (err) {
    console.error("❌ Error deleting visitors:", err.message);
    return res.status(500).json({ success: false, message: "Failed to delete visitors." });
  }
});

//  Serve Dashboard (frontend)
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

//  Serve static assets (JS/CSS)
app.use("/public", express.static(path.join(__dirname, "public")));

// ==========================
// Server Start
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
