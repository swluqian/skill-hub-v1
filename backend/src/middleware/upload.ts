import multer from 'multer';
import path from 'path';
import { env } from '../config/env';
import fs from 'fs';

const uploadDir = path.resolve(__dirname, '../../', env.upload.dir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const zipTypes = ['application/zip', 'application/x-zip-compressed', 'application/x-zip'];

const combinedFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'zipFile') {
    if (zipTypes.includes(file.mimetype) || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型，仅允许 ZIP 格式'));
    }
  } else {
    if (imageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型，仅允许 JPG、PNG、GIF、WebP、SVG'));
    }
  }
};

export const upload = multer({
  storage,
  fileFilter: combinedFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});
