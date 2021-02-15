import { Character } from '@/domain/model/character/Character'

export interface Comic {
  id: string
  title: string
  published: Date
  writer: string
  penciler: string
  coverArtist: string
  description: string
  edition: number
  coverImage: string
  characters: Character[]
}
