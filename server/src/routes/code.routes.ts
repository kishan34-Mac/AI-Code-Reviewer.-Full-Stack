import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { Review } from "../models/review.model";

const router = Router();

// POST /api/code/analyze
router.post(
  "/analyze",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { code, language, title } = req.body;

      if (!code || !language || !title?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title, code and language are required",
        });
      }

      const analysis = {
        bugs: [],
        security_issues: [],
        performance_issues: [],
        code_quality: {
          readability: 8,
          maintainability: 8,
          security: 8,
          performance: 8,
        },
        overall_score: 80,
        suggestions: ["Example suggestion: add real analyzer later"],
        refactored_code: code,
        test_cases: [],
      };

      const review = await Review.create({
        userId: new Types.ObjectId(req.userId),
        title: title.trim(),
        language,
        code,
        qualityScore: analysis.overall_score,
        analysis,
      });

      return res.json({
        success: true,
        analysis,
        reviewId: String(review._id),
      });
    } catch (error) {
      console.error("Error in /api/code/analyze:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to analyze code" });
    }
  },
);

export default router;
