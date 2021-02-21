import { Role } from './AuthenticationData'
import { StatusUser } from './StatusUser'

export interface User {
  id?: string
  name: string
  email: string
  role: Role
  password: string
  status: StatusUser
  comicsReactions?: any[]
  charactersReactions?: any[]
  profileImage?: string
  createAt?: Date
}
