import { CreateCharacterData } from '@/domain/model/character/CharacterData'
import { RepositoryInternalError } from '@/data/error'
import { InvalidParamError } from '@/domain/errors'
import { Either } from '@/shared/Either'

export interface CreateCharacterRepository {
  execute: (data: CreateCharacterData) => Promise<Either<RepositoryInternalError | InvalidParamError, void>>
}
