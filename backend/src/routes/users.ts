import { Router, Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { skillService } from '../services/skill.service';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { parsePagination } from '../utils/pagination';

const router = Router();

router.get('/profile', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await userService.getProfile(req.user!.userId);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

router.put('/profile', authMiddleware, upload.single('avatar'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: any = {};
    if (req.body.nickname !== undefined) data.nickname = req.body.nickname;
    if (req.body.bio !== undefined) data.bio = req.body.bio;
    if (req.file) data.avatar_url = `/uploads/${req.file.filename}`;

    const profile = await userService.updateProfile(req.user!.userId, data);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

router.get('/skills', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pagination = parsePagination(req.query as any);
    const result = await skillService.getUserSkills(req.user!.userId, pagination);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.put('/password', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: '请填写旧密码和新密码' });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: '新密码长度不能少于 6 位' });
      return;
    }
    await userService.changePassword(req.user!.userId, oldPassword, newPassword);
    res.json({ message: '密码修改成功' });
  } catch (err) {
    next(err);
  }
});

export default router;
