import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, nickname } = req.body;
    if (!email || !password || !nickname) {
      res.status(400).json({ error: '请填写邮箱、密码和昵称' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: '密码长度至少6位' });
      return;
    }
    const result = await authService.register(email, password, nickname);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: '请填写邮箱和密码' });
      return;
    }
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getCurrentUser(req.user!.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
