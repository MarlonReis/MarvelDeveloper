import { CharacterResponse } from '@/domain/model/character/CharacterData'

export interface CharacterOnlyId {
  id: string
}

export interface CreateComicData {
  title: string
  published: string
  writer: string
  penciler: string
  coverArtist: string
  description: string
  edition: string
  coverImage: string
  characters: CharacterOnlyId[]
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
  characters?: CharacterResponse[]
}
