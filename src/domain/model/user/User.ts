import { Comic } from '@/domain/model/comic/Comic'
import { Character } from '@/domain/model/character/Character'
import { Role } from './AuthenticationData'
import { StatusUser } from './StatusUser'

export interface User {
  id?: string
  name: string
  email: string
  role: Role
  password: string
  status: StatusUser
  favoriteComics?: Comic[]
  favoriteCharacters?: Character[]
  profileImage?: string
  createAt?: Date
}
