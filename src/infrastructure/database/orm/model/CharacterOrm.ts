import { InvalidParamError } from '@/domain/errors'
import { Character, CharacterBuilder } from '@/domain/model/character/Character'
import { CharacterValidationData, CreateCharacterData } from '@/domain/model/character/CharacterData'
import { Either, failure, success } from '@/shared/Either'

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ComicOrm } from './ComicOrm'

@Entity('characters')
export class CharacterOrm implements Character {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('text')
  description: string

  @Column('text')
  topImage: string

  @Column('text')
  profileImage: string

  @ManyToMany(type => ComicOrm, comics => comics.characters)
  comics: ComicOrm[]

  private constructor () { }

  public static create (data: CreateCharacterData): Either<InvalidParamError, CharacterOrm> {
    const fieldsRequired = ['name', 'topImage', 'profileImage', 'description']

    for (const field of fieldsRequired) {
      const response = CharacterValidationData[field](data[field])
      if (response.isFailure()) {
        return failure(response.value)
      }
    }

    return success(CharacterBuilder.build(new CharacterOrm())
      .name(data.name).description(data.description)
      .topImage(data.topImage).profileImage(data.profileImage)
      .now() as CharacterOrm)
  }
}
