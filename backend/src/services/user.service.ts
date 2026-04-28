import { User } from '../models';
import { AppError } from '../middleware/error-handler';
import { comparePassword, hashPassword } from '../utils/password';

export class UserService {
  async getProfile(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(404, '用户不存在');
    }
    return user.toSafeJSON();
  }

  async updateProfile(userId: number, data: { nickname?: string; bio?: string; avatar_url?: string }) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(404, '用户不存在');
    }

    if (data.nickname !== undefined) user.nickname = data.nickname;
    if (data.bio !== undefined) user.bio = data.bio;
    if (data.avatar_url !== undefined) user.avatar_url = data.avatar_url;

    await user.save();
    return user.toSafeJSON();
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(404, '用户不存在');
    }
    const matched = await comparePassword(oldPassword, user.password_hash);
    if (!matched) {
      throw new AppError(400, '旧密码错误');
    }
    user.password_hash = await hashPassword(newPassword);
    await user.save();
  }

  async changePasswordByAdmin(userId: number, newPassword: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(404, '用户不存在');
    }
    user.password_hash = await hashPassword(newPassword);
    await user.save();
  }

  async getAllUsers() {
    return User.findAll({ attributes: ['id', 'email', 'nickname', 'role', 'created_at'] });
  }
}

export const userService = new UserService();
