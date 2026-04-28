import api from './api';
import { Skill, PaginatedResponse, Category } from '../types';

export async function getSkills(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  sort?: string;
}): Promise<PaginatedResponse<Skill>> {
  const { data } = await api.get('/skills', { params });
  return data;
}

export async function getHotSkills(): Promise<Skill[]> {
  const { data } = await api.get('/skills/hot');
  return data;
}

export async function getRecommendedSkills(): Promise<Skill[]> {
  const { data } = await api.get('/skills/recommended');
  return data;
}

export async function getLatestSkills(): Promise<Skill[]> {
  const { data } = await api.get('/skills/latest');
  return data;
}

export async function getSkillById(id: number): Promise<Skill> {
  const { data } = await api.get(`/skills/${id}`);
  return data;
}

export async function createSkill(formData: FormData): Promise<Skill> {
  const { data } = await api.post('/skills', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateSkill(id: number, formData: FormData): Promise<Skill> {
  const { data } = await api.put(`/skills/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteSkill(id: number): Promise<void> {
  await api.delete(`/skills/${id}`);
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get('/categories');
  return data;
}
