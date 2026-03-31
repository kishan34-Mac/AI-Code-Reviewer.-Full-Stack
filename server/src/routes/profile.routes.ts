import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { User } from "../models/user.model";

const router = Router();

// GET /api/profile
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .select("_id name email createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// PUT /api/profile
router.put("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true },
    )
      .select("_id name email createdAt")
      .lean();

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
