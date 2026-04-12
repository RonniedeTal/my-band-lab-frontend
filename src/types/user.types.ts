// src/types/user.types.ts
import { UserRole } from './enums';

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  profileImageUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  surname: string;
  email?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  surname?: string;
  profileImageUrl?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}
