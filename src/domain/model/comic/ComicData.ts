import { CharacterResponse } from '@/domain/model/character/CharacterData'
import { Character } from '@/domain/model/character/Character'
import { Comic } from './Comic'

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

export class ComicBuilder {
  private comic: Comic
  private constructor () { }

  static build (comic: Comic): ComicBuilder {
    const builder = new ComicBuilder()
    builder.comic = comic
    return builder
  }

  title (title: string): this {
    this.comic.title = title
    return this
  }

  published (published: Date): this {
    this.comic.published = published
    return this
  }

  writer (writer: string): this {
    this.comic.writer = writer
    return this
  }

  penciler (penciler: string): this {
    this.comic.penciler = penciler
    return this
  }

  coverArtist (coverArtist: string): this {
    this.comic.coverArtist = coverArtist
    return this
  }

  description (description: string): this {
    this.comic.description = description
    return this
  }

  edition (edition: number): this {
    this.comic.edition = edition
    return this
  }

  coverImage (coverImage: string): this {
    this.comic.coverImage = coverImage
    return this
  }

  characters (characters: Character[] = []): this {
    this.comic.characters = characters
    return this
  }

  now (): Comic {
    return this.comic
  }
}
