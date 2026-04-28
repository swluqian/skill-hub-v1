import { Router, Request, Response, NextFunction } from 'express';
import { skillService } from '../services/skill.service';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { parsePagination } from '../utils/pagination';
import path from 'path';
import { env } from '../config/env';

const router = Router();

// Public routes
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pagination = parsePagination(req.query as any);
    const result = await skillService.getList({
      ...pagination,
      search: req.query.search as string,
      categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string, 10) : undefined,
      sort: req.query.sort as string,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/hot', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const skills = await skillService.getHot();
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

router.get('/recommended', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const skills = await skillService.getRecommended();
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

router.get('/latest', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const skills = await skillService.getLatest();
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/download', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skill = await skillService.getById(parseInt(req.params.id, 10));
    if (!skill.install_zip_url) {
      res.status(404).json({ error: '该 Skill 没有可下载的 zip 包' });
      return;
    }
    const filePath = path.resolve(__dirname, '../../', skill.install_zip_url.replace(/^\//, ''));
    const downloadName = `${skill.name}.zip`;
    await skillService.incrementDownloadCount(parseInt(req.params.id, 10));
    res.download(filePath, downloadName);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skill = await skillService.getById(parseInt(req.params.id, 10));
    res.json(skill);
  } catch (err) {
    next(err);
  }
});

// Protected routes
router.post('/', authMiddleware, upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'zipFile', maxCount: 1 }]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, content, version, install_command, category_id } = req.body;
    if (!name || !description || !version || !category_id) {
      res.status(400).json({ error: '请填写名称、描述、版本和分类' });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const icon_url = files?.icon?.[0] ? `/uploads/${files.icon[0].filename}` : undefined;
    const install_zip_url = files?.zipFile?.[0] ? `/uploads/${files.zipFile[0].filename}` : undefined;

    const skill = await skillService.create({
      name,
      description,
      content,
      version,
      icon_url,
      install_command,
      install_zip_url,
      category_id: parseInt(category_id, 10),
      author_id: req.user!.userId,
    });
    res.status(201).json(skill);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authMiddleware, upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'zipFile', maxCount: 1 }]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: any = {};
    const fields = ['name', 'description', 'content', 'version', 'install_command', 'category_id'];
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        data[field] = field === 'category_id' ? parseInt(req.body[field], 10) : req.body[field];
      }
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (files?.icon?.[0]) {
      data.icon_url = `/uploads/${files.icon[0].filename}`;
    }
    if (files?.zipFile?.[0]) {
      data.install_zip_url = `/uploads/${files.zipFile[0].filename}`;
    }

    const skill = await skillService.update(parseInt(req.params.id, 10), req.user!.userId, req.user!.role === 'admin', data);
    res.json(skill);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await skillService.delete(
      parseInt(req.params.id, 10),
      req.user!.userId,
      req.user!.role === 'admin'
    );
    res.json({ message: '删除成功' });
  } catch (err) {
    next(err);
  }
});

export default router;
