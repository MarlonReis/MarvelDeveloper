import { CreateCharacterData } from '@/domain/model/character/CharacterData'
import { InvalidParamError } from '@/domain/errors'
import { Either } from '@/shared/Either'

export interface CreateCharacter {
  execute: (data: CreateCharacterData) => Promise<Either<InvalidParamError, void>>
}
