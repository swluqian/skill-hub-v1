import { Op } from 'sequelize';
import { Skill, User, Category } from '../models';
import { PaginationParams, buildPaginationResult } from '../utils/pagination';
import { AppError } from '../middleware/error-handler';

function compareVersions(newVersion: string, currentVersion: string): number {
  const newParts = newVersion.split('.').map(Number);
  const currentParts = currentVersion.split('.').map(Number);
  for (let i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
    const newPart = newParts[i] || 0;
    const currentPart = currentParts[i] || 0;
    if (newPart > currentPart) return 1;
    if (newPart < currentPart) return -1;
  }
  return 0;
}

const skillIncludes = [
  { model: User, as: 'author', attributes: ['id', 'nickname', 'avatar_url'] },
  { model: Category, as: 'category', attributes: ['id', 'name'] },
];

export class SkillService {
  async getList(params: PaginationParams & { search?: string; categoryId?: number; sort?: string }) {
    const where: any = { status: 'approved' };

    if (params.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${params.search}%` } },
        { description: { [Op.like]: `%${params.search}%` } },
      ];
    }

    if (params.categoryId) {
      where.category_id = params.categoryId;
    }

    let order: any[] = [['created_at', 'DESC']];
    if (params.sort === 'downloads') {
      order = [['download_count', 'DESC']];
    } else if (params.sort === 'name') {
      order = [['name', 'ASC']];
    }

    const { count, rows } = await Skill.findAndCountAll({
      where,
      include: skillIncludes,
      order,
      limit: params.pageSize,
      offset: (params.page - 1) * params.pageSize,
    });

    return buildPaginationResult(rows, count, params);
  }

  async getHot(limit: number = 10) {
    return Skill.findAll({
      where: { status: 'approved' },
      include: skillIncludes,
      order: [['download_count', 'DESC']],
      limit,
    });
  }

  async getRecommended(limit: number = 10) {
    return Skill.findAll({
      where: { status: 'approved', is_recommended: true },
      include: skillIncludes,
      order: [['updated_at', 'DESC']],
      limit,
    });
  }

  async getLatest(limit: number = 10) {
    return Skill.findAll({
      where: { status: 'approved' },
      include: skillIncludes,
      order: [['created_at', 'DESC']],
      limit,
    });
  }

  async getById(id: number) {
    const skill = await Skill.findByPk(id, { include: skillIncludes });
    if (!skill) {
      throw new AppError(404, 'Skill 不存在');
    }
    return skill;
  }

  async create(data: {
    name: string;
    description: string;
    content?: string;
    version: string;
    icon_url?: string;
    install_command?: string;
    install_zip_url?: string;
    category_id: number;
    author_id: number;
  }) {
    const category = await Category.findByPk(data.category_id);
    if (!category) {
      throw new AppError(400, '分类不存在');
    }

    return Skill.create({
      ...data,
      status: 'pending',
      download_count: 0,
      is_recommended: false,
      parent_id: null,
    });
  }

  async update(id: number, userId: number, isAdmin: boolean = false, data: Partial<{
    name: string;
    description: string;
    content: string;
    version: string;
    icon_url: string;
    install_command: string;
    install_zip_url: string;
    category_id: number;
  }>) {
    const skill = await Skill.findByPk(id);
    if (!skill) {
      throw new AppError(404, 'Skill 不存在');
    }
    if (skill.author_id !== userId && !isAdmin) {
      throw new AppError(403, '只能编辑自己提交的 Skill');
    }

    if (skill.status === 'approved') {
      if (data.version !== undefined && compareVersions(data.version, skill.version) <= 0) {
        throw new AppError(400, '新版本号必须大于当前版本号');
      }
      const newSkill = await Skill.create({
        name: data.name ?? skill.name,
        description: data.description ?? skill.description,
        content: data.content ?? skill.content,
        version: data.version ?? skill.version,
        icon_url: data.icon_url ?? skill.icon_url,
        install_command: data.install_command ?? skill.install_command,
        install_zip_url: data.install_zip_url ?? skill.install_zip_url,
        category_id: data.category_id ?? skill.category_id,
        author_id: skill.author_id,
        status: 'pending',
        download_count: 0,
        is_recommended: false,
        parent_id: skill.id,
        reject_reason: null,
      });
      return newSkill;
    } else {
      if (data.version !== undefined && compareVersions(data.version, skill.version) <= 0) {
        throw new AppError(400, '新版本号必须大于当前版本号');
      }
      Object.assign(skill, data);
      skill.status = 'pending';
      skill.reject_reason = null;
      await skill.save();
      return skill;
    }
  }

  async delete(id: number, userId: number, isAdmin: boolean) {
    const skill = await Skill.findByPk(id);
    if (!skill) {
      throw new AppError(404, 'Skill 不存在');
    }
    if (skill.author_id !== userId && !isAdmin) {
      throw new AppError(403, '无权删除此 Skill');
    }
    await skill.destroy();
  }

  async getUserSkills(userId: number, params: PaginationParams) {
    const { count, rows } = await Skill.findAndCountAll({
      where: { author_id: userId },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
      limit: params.pageSize,
      offset: (params.page - 1) * params.pageSize,
    });

    return buildPaginationResult(rows, count, params);
  }

  async incrementDownloadCount(id: number) {
    await Skill.increment('download_count', { by: 1, where: { id } });
  }

  async getAdminList(params: PaginationParams) {
    const { count, rows } = await Skill.findAndCountAll({
      include: skillIncludes,
      order: [['created_at', 'DESC']],
      limit: params.pageSize,
      offset: (params.page - 1) * params.pageSize,
    });
    return buildPaginationResult(rows, count, params);
  }
}

export const skillService = new SkillService();
