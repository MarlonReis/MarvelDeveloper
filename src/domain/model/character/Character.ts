import { Comic } from '@/domain/model/comic/Comic'

export interface Character {
  id: string
  name: string
  description: string
  topImage: string
  profileImage: string
  comics: Comic[]
}
