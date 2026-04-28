import { User } from '../models';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/error-handler';

export class AuthService {
  async register(email: string, password: string, nickname: string) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new AppError(409, '该邮箱已注册');
    }

    const password_hash = await hashPassword(password);
    const user = await User.create({ email, password_hash, nickname });
    const token = generateToken({ userId: user.id, role: user.role });

    return { user: user.toSafeJSON(), token };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError(401, '邮箱或密码错误');
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      throw new AppError(401, '邮箱或密码错误');
    }

    const token = generateToken({ userId: user.id, role: user.role });
    return { user: user.toSafeJSON(), token };
  }

  async getCurrentUser(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(404, '用户不存在');
    }
    return user.toSafeJSON();
  }
}

export const authService = new AuthService();
