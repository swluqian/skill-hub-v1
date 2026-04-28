import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface SkillAttributes {
  id: number;
  name: string;
  description: string;
  content: string | null;
  version: string;
  icon_url: string | null;
  install_command: string | null;
  install_zip_url: string | null;
  download_count: number;
  status: 'pending' | 'approved' | 'rejected' | 'superseded';
  is_recommended: boolean;
  author_id: number;
  category_id: number;
  parent_id: number | null;
  reject_reason: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface SkillCreationAttributes
  extends Optional<
    SkillAttributes,
    'id' | 'content' | 'icon_url' | 'install_command' | 'install_zip_url' | 'download_count' | 'status' | 'is_recommended' | 'parent_id' | 'reject_reason'
  > {}

export class Skill extends Model<SkillAttributes, SkillCreationAttributes> implements SkillAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public content!: string | null;
  public version!: string;
  public icon_url!: string | null;
  public install_command!: string | null;
  public install_zip_url!: string | null;
  public download_count!: number;
  public status!: 'pending' | 'approved' | 'rejected' | 'superseded';
  public is_recommended!: boolean;
  public author_id!: number;
  public category_id!: number;
  public parent_id!: number | null;
  public reject_reason!: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Skill.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    version: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    icon_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    install_command: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    install_zip_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    download_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'superseded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    is_recommended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reject_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'skills',
    timestamps: true,
    underscored: true,
  }
);
