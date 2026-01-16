export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role?: Role;
  roles?: string[];
  permissions?: Permission[];
}

export interface Role {
  id: number;
  nom: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  nom: string;
  description?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleName?: string;
}

export interface RoleOption {
  id: number;
  name: string;
  description: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
}
