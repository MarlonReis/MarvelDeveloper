import { StatusUser } from './StatusUser'

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export interface UpdateUserData {
  id: string
  name?: string
  email?: string
  status?: StatusUser
  password?: string
  profileImage?: string
}

export interface UserAccountResponse {
  id?: string
  name: string
  email: string
  status: StatusUser
}
