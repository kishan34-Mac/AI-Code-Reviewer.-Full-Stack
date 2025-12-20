// server/src/routes/review.routes.ts
import { Router, Request, Response } from "express";

const router = Router();

// GET /api/reviews/stats
router.get("/stats", async (req: Request, res: Response) => {
  try {
    // later you can use req.user.id from JWT middleware
    const reviewCount = 0;
    const bugsFound = 0;
    const avgQualityScore = null;

    return res.json({
      success: true,
      reviewCount,
      bugsFound,
      avgQualityScore,
    });
  } catch (error) {
    console.error("Error in /api/reviews/stats:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load stats" });
  }
});

export default router;
