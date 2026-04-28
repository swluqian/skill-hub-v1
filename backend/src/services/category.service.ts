import { Category } from '../models';

export class CategoryService {
  async getAll() {
    return Category.findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
    });
  }
}

export const categoryService = new CategoryService();
