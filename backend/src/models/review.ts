import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ReviewAttributes {
  id: number;
  skill_id: number;
  reviewer_id: number;
  action: 'approve' | 'reject';
  reason: string | null;
  created_at?: Date;
}

export interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id' | 'reason'> {}

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public skill_id!: number;
  public reviewer_id!: number;
  public action!: 'approve' | 'reject';
  public reason!: string | null;
  public readonly created_at!: Date;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    skill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reviewer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM('approve', 'reject'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
    updatedAt: false,
  }
);
