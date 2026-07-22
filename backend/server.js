require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Enable CORS allowing all development origins & credentials
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Base Route Registrations
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Feature Route Registrations
const taskRoutes = require("./routes/taskRoutes");
const examRoutes = require("./routes/examRoutes");
const lmsRoutes = require("./routes/lmsRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const githubRoutes = require("./routes/githubRoutes");
const linkedinRoutes = require("./routes/linkedinRoutes");
const historyRoutes = require("./routes/historyRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/ai", aiRoutes);

app.use("/api/tasks", taskRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/lms", lmsRoutes);

// Register both /api/internships and /api/internship for complete route compatibility
app.use("/api/internships", internshipRoutes);
app.use("/api/internship", internshipRoutes);
console.log("✓ Internship Routes Loaded");

app.use("/api/github", githubRoutes);
app.use("/api/linkedin", linkedinRoutes);
app.use("/api/history", historyRoutes);

// Base Endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student AI Mentor API is running successfully",
    data: {
      status: "OK",
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found - ${req.originalUrl}`,
  });
});

// Centralized Error Middleware
app.use((err, req, res, next) => {
  console.error("Centralized Error Middleware Caught Exception:", err.stack || err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✓ Backend server listening on http://0.0.0.0:${PORT} (http://localhost:${PORT})`);
});
