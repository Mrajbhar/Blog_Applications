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

/* ---------------- Morgan ---------------- */
morgan.token("statusColored", (req, res) => {
  const status = res.headersSent ? res.statusCode : "-";
  const code =
    status >= 500 ? 31 :
    status >= 400 ? 33 :
    status >= 300 ? 36 :
    status >= 200 ? 32 : 37;
  return `\x1b[${code}m${status}\x1b[0m`;
});

const devFormat =
  ":method :url :statusColored :response-time ms - :res[content-length]";
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : devFormat;

app.use(
  morgan(morganFormat, {
    skip: (req) => req.originalUrl === "/",
  })
);

/* ---------------- Core middleware ---------------- */
app.use(express.json());
app.use(cookieParser());

/* ---------------- MongoDB ---------------- */
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* ---------------- CORS ---------------- */
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_PROD,
  "http://localhost:5173", // Vite default port — keep this for local dev
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ---------------- Routes ---------------- */
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API Running Successfully 🚀",
  });
});

/* ---------------- 404 + Error handler ---------------- */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal Server Error",
  });
});

/* ---------------- Listen locally, export for Vercel ---------------- */
// Vercel sets process.env.VERCEL = "1" automatically.
// When running locally, start a real HTTP server.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server listening at http://localhost:${PORT}`);
  });
}

export default app;