import { User } from './user';
import { Skill } from './skill';
import { Category } from './category';
import { Review } from './review';

// User has many Skills
User.hasMany(Skill, { foreignKey: 'author_id', as: 'skills' });
Skill.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// Category has many Skills
Category.hasMany(Skill, { foreignKey: 'category_id', as: 'skills' });
Skill.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Skill has many Reviews
Skill.hasMany(Review, { foreignKey: 'skill_id', as: 'reviews' });
Review.belongsTo(Skill, { foreignKey: 'skill_id', as: 'skill' });

// Skill has many child versions (via parent_id)
Skill.hasMany(Skill, { foreignKey: 'parent_id', as: 'children' });
Skill.belongsTo(Skill, { foreignKey: 'parent_id', as: 'parent', constraints: false });

// User (reviewer) has many Reviews
User.hasMany(Review, { foreignKey: 'reviewer_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'reviewer_id', as: 'reviewer' });

export { User, Skill, Category, Review };
