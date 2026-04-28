import { Review, Skill, User, Category } from '../models';
import { AppError } from '../middleware/error-handler';

export class ReviewService {
  async approve(skillId: number, reviewerId: number) {
    const skill = await Skill.findByPk(skillId, {
      include: [{ model: Skill, as: 'parent' }],
    });
    if (!skill) {
      throw new AppError(404, 'Skill 不存在');
    }

    if (skill.parent_id) {
      const parentSkill = await Skill.findByPk(skill.parent_id);
      if (parentSkill && parentSkill.status === 'approved') {
        parentSkill.status = 'superseded';
        await parentSkill.save();
      }
    }

    skill.status = 'approved';
    skill.reject_reason = null;
    await skill.save();

    await Review.create({
      skill_id: skillId,
      reviewer_id: reviewerId,
      action: 'approve',
    });

    return skill;
  }

  async reject(skillId: number, reviewerId: number, reason: string) {
    const skill = await Skill.findByPk(skillId);
    if (!skill) {
      throw new AppError(404, 'Skill 不存在');
    }

    if (!reason || reason.trim() === '') {
      throw new AppError(400, '请填写拒绝原因');
    }

    if (reason.length > 500) {
      throw new AppError(400, '拒绝原因不能超过 500 字');
    }

    skill.status = 'rejected';
    skill.reject_reason = reason;
    await skill.save();

    await Review.create({
      skill_id: skillId,
      reviewer_id: reviewerId,
      action: 'reject',
      reason,
    });

    return skill;
  }

  async getPendingSkills() {
    return Skill.findAll({
      where: { status: 'pending' },
      include: [
        { model: User, as: 'author', attributes: ['id', 'nickname', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Skill, as: 'parent', attributes: ['id', 'version'] },
      ],
      order: [['created_at', 'ASC']],
    });
  }

  async getReviews() {
    return Review.findAll({
      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name', 'version', 'description', 'status'],
          include: [
            { model: User, as: 'author', attributes: ['id', 'nickname'] },
            { model: Category, as: 'category', attributes: ['id', 'name'] },
          ],
        },
        { model: User, as: 'reviewer', attributes: ['id', 'nickname'] },
      ],
      order: [['created_at', 'DESC']],
      limit: 50,
    });
  }
}

export const reviewService = new ReviewService();
