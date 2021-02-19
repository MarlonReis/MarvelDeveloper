import { CharacterResponse } from '@/domain/model/character/CharacterData'
import { Character } from '@/domain/model/character/Character'
import { Comic } from './Comic'
import { InvalidParamError } from '@/domain/errors'
import { Either, success } from '@/shared/Either'
import {
  Description, Edition, Name, PathFile, Published, Title
} from '@/domain/value-object'

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

export const buildComicResponse = (comic: Comic): ComicResponse => ({
  id: comic.id,
  title: comic.title,
  published: comic.published.toString(),
  writer: comic.writer,
  penciler: comic.penciler,
  coverArtist: comic.coverArtist,
  description: comic.description,
  edition: comic.edition.toString(),
  coverImage: comic.coverImage,
  characters: comic.characters.map(character => ({
    id: character.id,
    name: character.name,
    description: character.description,
    topImage: character.topImage,
    profileImage: character.profileImage
  }))
})

export const ComicValidationData = {
  title (title: string): Either<InvalidParamError, Title> {
    return Title.create(title)
  },
  published (published: string): Either<InvalidParamError, Published> {
    return Published.create(published)
  },
  writer (writer: string): Either<InvalidParamError, Name> {
    return Name.create('writer', writer)
  },
  penciler (penciler: string): Either<InvalidParamError, Name> {
    return Name.create('penciler', penciler)
  },
  coverArtist (coverArtist: string): Either<InvalidParamError, Name> {
    return Name.create('coverArtist', coverArtist)
  },
  description (description: string): Either<InvalidParamError, Description> {
    return Description.create(description)
  },
  edition (edition: string): Either<InvalidParamError, Edition> {
    return Edition.create(edition)
  },
  coverImage (coverImage: string): Either<InvalidParamError, PathFile> {
    return PathFile.create('coverImage', coverImage)
  },
  characters (characters: Character[] = []): Either<InvalidParamError, Character[]> {
    return success(characters)
  }
}

export class ComicBuilder {
  private comic: Comic
  private constructor () { }

  static build (comic: Comic): ComicBuilder {
    const builder = new ComicBuilder()
    builder.comic = comic
    return builder
  }

  id (id: string): this {
    this.comic.id = id
    return this
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
