import { Router, Response } from "express";
import { Types } from "mongoose";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { Review } from "../models/review.model";

const router = Router();

function toReviewResponse(review: {
  _id: unknown;
  title: string;
  language: string;
  qualityScore: number;
  analysis: unknown;
  createdAt: Date;
}) {
  return {
    id: String(review._id),
    title: review.title,
    language: review.language,
    quality_score: review.qualityScore,
    analysis: review.analysis,
    created_at: review.createdAt,
  };
}

function getUserObjectId(userId?: string) {
  return userId ? new Types.ObjectId(userId) : null;
}

router.get(
  "/stats",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const userObjectId = getUserObjectId(req.userId);

      if (!userObjectId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const reviews = await Review.find({ userId: userObjectId })
        .select("qualityScore analysis")
        .lean();

      let bugsFound = 0;
      let totalScore = 0;
      let scoredCount = 0;

      for (const review of reviews) {
        const analysis = review.analysis as {
          bugs?: Array<unknown>;
        };

        if (analysis?.bugs) {
          bugsFound += analysis.bugs.length;
        }

        if (typeof review.qualityScore === "number") {
          totalScore += review.qualityScore;
          scoredCount += 1;
        }
      }

      return res.json({
        success: true,
        reviewCount: reviews.length,
        bugsFound,
        avgQualityScore: scoredCount > 0 ? totalScore / scoredCount : null,
      });
    } catch (error) {
      console.error("Error in /api/reviews/stats:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to load stats" });
    }
  },
);

router.get("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userObjectId = getUserObjectId(req.userId);

    if (!userObjectId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const review = await Review.findOne({
      _id: req.params.id,
      userId: userObjectId,
    }).lean();

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.json({
      success: true,
      review: toReviewResponse(review),
    });
  } catch (error) {
    console.error("Error in GET /api/reviews/:id:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load review" });
  }
});

router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userObjectId = getUserObjectId(req.userId);

    if (!userObjectId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const reviews = await Review.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      reviews: reviews.map(toReviewResponse),
    });
  } catch (error) {
    console.error("Error in GET /api/reviews:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load reviews" });
  }
});

router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const userObjectId = getUserObjectId(req.userId);

      if (!userObjectId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const deletedReview = await Review.findOneAndDelete({
        _id: req.params.id,
        userId: userObjectId,
      });

      if (!deletedReview) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }

      return res.json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error) {
      console.error("Error in DELETE /api/reviews/:id:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete review" });
    }
  },
);

export default router;
