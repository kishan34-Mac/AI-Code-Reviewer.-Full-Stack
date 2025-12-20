import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { supabase } from '../config/supabase';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Protected route example - Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).userId;

    const { data: user, error } = await supabase
      .from('User')
      .select('id, name, email, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

export default router;
