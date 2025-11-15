const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const questionRoutes = require("./src/routes/questionRoutes");
const authRoutes = require("./src/routes/authRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

dotenv.config();

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5174";

connectDB();

const app = express();

// Middleware
// In development allow the requesting origin dynamically so the frontend
// dev server can run on different ports (5173 or 5174). In production
// use a fixed CORS_ORIGIN.
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: true, credentials: true }));
  console.log("✓ CORS: allowing dynamic origin for development");
} else {
  app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
  console.log(`✓ CORS enabled for: ${CORS_ORIGIN}`);
}
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "StudyPro API running",
    status: "ok",
    environment: process.env.NODE_ENV || "development"
  });
});

// API Routes
app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✓ CORS enabled for: ${CORS_ORIGIN}`);
});
