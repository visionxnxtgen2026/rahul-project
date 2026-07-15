const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");

const app = express();

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// Connect Database
// =========================
(async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ Database Connection Failed:", err);
  }
})();

// =========================
// Health Check Route
// =========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GovExamConnect Backend is Running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// =========================
// API Routes
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);

// =========================
// 404 Route
// =========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// =========================
// Global Error Handler
// =========================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Export for Vercel
module.exports = app;
