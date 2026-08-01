import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    message: "Server is healthy and running",
  });
});

export default router;
