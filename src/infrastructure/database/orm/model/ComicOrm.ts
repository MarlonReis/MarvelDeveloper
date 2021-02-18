import {
  Column, Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

import { CharacterOrm } from './CharacterOrm'
import { Comic } from '@/domain/model/comic/Comic'
import {
  ComicBuilder,
  CreateComicData,
  ComicValidationData
} from '@/domain/model/comic/ComicData'
import { InvalidParamError } from '@/domain/errors'
import { Either, failure, success } from '@/shared/Either'
import { Published } from '@/domain/value-object'

@Entity('comics')
export class ComicOrm implements Comic {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 150 })
  title: string

  @Column('date')
  published: Date

  @Column('varchar')
  writer: string

  @Column('varchar')
  penciler: string

  @Column('varchar')
  coverArtist: string

  @Column('text')
  description: string

  @Column('int')
  edition: number

  @Column('text')
  coverImage: string

  @JoinTable({ name: 'comic_has_many_characters' })
  @ManyToMany(type => CharacterOrm, characters => characters.comics, {
    eager: true
  })
  characters: CharacterOrm[]

  private constructor () { }

  static create (data: CreateComicData): Either<InvalidParamError, ComicOrm> {
    const requiredFields = ['title', 'published', 'writer', 'penciler', 'coverArtist',
      'description', 'edition', 'coverImage', 'characters']

    for (const field of requiredFields) {
      const response = ComicValidationData[field](data[field])
      if (response.isFailure()) {
        return failure(response.value)
      }
    }
    const published: Published = Published.create(data.published).value as Published

    return success(ComicBuilder.build(new ComicOrm())
      .title(data.title).writer(data.writer)
      .penciler(data.penciler).coverArtist(data.coverArtist)
      .description(data.description).coverImage(data.coverImage)
      .published(published.value).edition(parseInt(data.edition))
      .characters(data.characters as CharacterOrm[]).now() as ComicOrm)
  }
}
