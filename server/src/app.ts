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
 


export default app;
