import api from './api';
import { User, PaginatedResponse, Skill, Review } from '../types';

export async function getProfile(): Promise<User> {
  const { data } = await api.get('/users/profile');
  return data;
}

export async function updateProfile(formData: FormData): Promise<User> {
  const { data } = await api.put('/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getUserSkills(page: number = 1): Promise<PaginatedResponse<Skill>> {
  const { data } = await api.get('/users/skills', { params: { page } });
  return data;
}

// Admin APIs
export async function getPendingSkills(): Promise<Skill[]> {
  const { data } = await api.get('/admin/skills/pending');
  return data;
}

export async function approveSkill(id: number): Promise<Skill> {
  const { data } = await api.post(`/admin/skills/${id}/approve`);
  return data;
}

export async function rejectSkill(id: number, reason: string): Promise<Skill> {
  const { data } = await api.post(`/admin/skills/${id}/reject`, { reason });
  return data;
}

export async function getReviews(): Promise<Review[]> {
  const { data } = await api.get('/admin/reviews');
  return data;
}

export async function getAdminSkillList(params?: { page?: number; pageSize?: number }): Promise<PaginatedResponse<Skill>> {
  const { data } = await api.get('/admin/skills', { params });
  return data;
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  await api.put('/users/password', { oldPassword, newPassword });
}

export async function getAllUsers(): Promise<any[]> {
  const { data } = await api.get('/admin/users');
  return data;
}

export async function changeUserPassword(userId: number, newPassword: string): Promise<void> {
  await api.put(`/admin/users/${userId}/password`, { newPassword });
}
