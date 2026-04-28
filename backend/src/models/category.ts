import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CategoryAttributes {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
  created_at?: Date;
}

export interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'description' | 'sort_order'> {}

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public sort_order!: number;
  public readonly created_at!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
    underscored: true,
    updatedAt: false,
  }
);
