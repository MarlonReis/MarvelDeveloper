import { RepositoryInternalError } from '@/data/error'
import { CreateCharacterData } from '@/domain/model/character/CharacterData'
import { Either } from '@/shared/Either'

export interface CreateCharacterRepository {
  execute: (data: CreateCharacterData) => Promise<Either<RepositoryInternalError, void>>
}
