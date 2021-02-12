import { StatusUser } from './StatusUser'

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export interface UserAccountResponse {
  name: string
  email: string
  status: StatusUser
}
