import { Router, Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/review.service';
import { skillService } from '../services/skill.service';
import { userService } from '../services/user.service';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import { parsePagination } from '../utils/pagination';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/skills', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pagination = parsePagination(req.query as any);
    const result = await skillService.getAdminList(pagination);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/skills/pending', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const skills = await reviewService.getPendingSkills();
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

router.post('/skills/:id/approve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skill = await reviewService.approve(parseInt(req.params.id, 10), req.user!.userId);
    res.json(skill);
  } catch (err) {
    next(err);
  }
});

router.post('/skills/:id/reject', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;
    const skill = await reviewService.reject(parseInt(req.params.id, 10), req.user!.userId, reason);
    res.json(skill);
  } catch (err) {
    next(err);
  }
});

router.get('/reviews', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.getReviews();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.get('/users', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.put('/users/:id/password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ error: '新密码长度不能少于 6 位' });
      return;
    }
    await userService.changePasswordByAdmin(parseInt(req.params.id, 10), newPassword);
    res.json({ message: '密码修改成功' });
  } catch (err) {
    next(err);
  }
});

export default router;
