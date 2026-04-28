import api from './api';
import { AuthResponse, User } from '../types';

export async function register(email: string, password: string, nickname: string): Promise<AuthResponse> {
  const { data } = await api.post('/auth/register', { email, password, nickname });
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get('/auth/me');
  return data;
}
