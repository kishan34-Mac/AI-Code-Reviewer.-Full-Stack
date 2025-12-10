// src/routes/auth.routes.ts
import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

// This gives POST /api/auth/register
router.post("/register", register);

// This gives POST /api/auth/login
router.post("/login", login);

export default router;
