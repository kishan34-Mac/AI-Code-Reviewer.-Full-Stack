import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { supabase } from "../config/supabase";

const router = Router();

// GET /api/profile
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { data: user, error } = await supabase
      .from("User")
      .select("id, name, email, created_at")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
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

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const { data: user, error } = await supabase
      .from("User")
      .update({ name: name.trim(), updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select("id, name, email, created_at")
      .single();

    if (error || !user) {
      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
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
