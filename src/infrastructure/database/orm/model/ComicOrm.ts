import {
  Column, Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

import { CharacterOrm } from './CharacterOrm'
import { Comic } from '@/domain/model/comic/Comic'
import { ComicBuilder, CreateComicData } from '@/domain/model/comic/ComicData'
import { InvalidParamError } from '@/domain/errors'
import { Either, failure, success } from '@/shared/Either'
import { Description, Name, PathFile, Published, Title } from '@/domain/value-object'

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
    const titleOrError = Title.create(data.title)
    const writerOrError = Name.create(data.writer)
    const pencilerOrError = Name.create(data.penciler)
    const coverArtistOrError = Name.create(data.coverArtist)
    const descriptionOrError = Description.create(data.description)
    const coverImageOrError = PathFile.create('coverImage', data.coverImage)
    const publishedOrError = Published.create(data.published)

    if (titleOrError.isFailure()) {
      return failure(titleOrError.value)
    }

    if (writerOrError.isFailure()) {
      return failure(writerOrError.value)
    }

    if (pencilerOrError.isFailure()) {
      return failure(pencilerOrError.value)
    }

    if (coverArtistOrError.isFailure()) {
      return failure(coverArtistOrError.value)
    }

    if (descriptionOrError.isFailure()) {
      return failure(descriptionOrError.value)
    }

    if (coverImageOrError.isFailure()) {
      return failure(coverImageOrError.value)
    }

    if (publishedOrError.isFailure()) {
      return failure(publishedOrError.value)
    }

    const comic: ComicOrm = ComicBuilder
      .build(new ComicOrm())
      .title(titleOrError.value.value)
      .writer(writerOrError.value.value)
      .penciler(pencilerOrError.value.value)
      .coverArtist(coverArtistOrError.value.value)
      .description(descriptionOrError.value.value)
      .coverImage(coverImageOrError.value.getValue())
      .published(publishedOrError.value.value)
      .edition(parseInt(data.edition))
      .characters(data.characters as any[])
      .now() as ComicOrm

    return success(comic)
  }
}
