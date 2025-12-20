// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import reviewRoutes from "./routes/review.routes"
import codeRoutes from "./routes/code.routes";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); // base path
app.use("/api/reviews", reviewRoutes);
app.use("/api/code", codeRoutes); // <-- important
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8081',
    'https://ai-code-reviewer-full-stack.vercel.app',  // Your actual Vercel URL
    /\.vercel\.app$/
  ],
  credentials: true
}));
 


export default app;
