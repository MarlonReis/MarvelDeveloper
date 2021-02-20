
export interface AuthData {
  email: string
  password: string
}

export interface AuthResponse {
  id: string
}

export enum Role {
  ADMIN = 'ROLE_ADMIN',
  USER = 'ROLE_USER'
}
