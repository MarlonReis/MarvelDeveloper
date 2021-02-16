import { InvalidParamError } from '@/domain/errors'
import { Character, CharacterBuilder } from '@/domain/model/character/Character'
import { CharacterValidationData, CreateCharacterData } from '@/domain/model/character/CharacterData'
import { Comic } from '@/domain/model/comic/Comic'
import { Either, failure, success } from '@/shared/Either'
import { ComicOrm } from './ComicOrm'

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('characters')
export class CharacterOrm implements Character {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 150 })
  name: string

  @Column('text')
  description: string

  @Column('text')
  topImage: string

  @Column('text')
  profileImage: string

  @ManyToMany(() => ComicOrm)
  comics: Comic[]

  private constructor () { }

  protected static instance (): CharacterOrm {
    return new CharacterOrm()
  }

  public static create (data: CreateCharacterData): Either<InvalidParamError, CharacterOrm> {
    const fieldsRequired = ['name', 'topImage', 'profileImage', 'description']

    for (const field of fieldsRequired) {
      const response = CharacterValidationData[field](data[field])
      if (response.isFailure()) {
        return failure(response.value)
      }
    }

    const user = CharacterBuilder.build(new CharacterOrm())
      .name(data.name).description(data.description)
      .topImage(data.topImage).profileImage(data.profileImage)
      .now()

    return success(user)
  }
}
