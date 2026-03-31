// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import reviewRoutes from "./routes/review.routes";
import codeRoutes from "./routes/code.routes";
import profileRoutes from "./routes/profile.routes";

dotenv.config();

const app = express();

// CORS must be configured BEFORE routes
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:8081",
      "https://ai-code-reviewer-full-stack.vercel.app",
      /\.vercel\.app$/,
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/code", codeRoutes);

export default app;
