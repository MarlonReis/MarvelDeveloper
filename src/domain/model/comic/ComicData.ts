import { Character } from '@/domain/model/character/Character'

export interface CreateComicData {
  title: string
  published: string
  writer: string
  penciler: string
  coverArtist: string
  description: string
  edition: string
  coverImage: string
  characters: Character[]
}

export interface ComicResponse {
  id: string
  title: string
  published: string
  writer: string
  penciler: string
  coverArtist: string
  description: string
  edition: string
  coverImage: string
  characters?: Character[]
}
