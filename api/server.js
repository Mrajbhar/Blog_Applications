import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API Running Successfully 🚀",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;

// Run locally only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
