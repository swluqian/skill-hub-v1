import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err.name === 'SequelizeValidationError') {
    res.status(400).json({ error: '数据验证失败', details: (err as any).errors?.map((e: any) => e.message) });
    return;
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(409).json({ error: '数据已存在' });
    return;
  }

  res.status(500).json({ error: '服务器内部错误' });
}
