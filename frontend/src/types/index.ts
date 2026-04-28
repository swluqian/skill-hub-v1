export interface User {
  id: number;
  email: string;
  nickname: string;
  avatar_url: string | null;
  bio: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface Skill {
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
  createdAt: string;
  updatedAt: string;
  author?: { id: number; nickname: string; avatar_url: string | null };
  category?: { id: number; name: string };
  parent?: { id: number; version: string };
}

export interface Review {
  id: number;
  skill_id: number;
  reviewer_id: number;
  action: 'approve' | 'reject';
  reason: string | null;
  createdAt: string;
  skill?: { id: number; name: string };
  reviewer?: { id: number; nickname: string };
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface AuthResponse {
  user: User;
  token: string;
}
