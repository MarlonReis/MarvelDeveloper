import { CharacterResponse } from '@/domain/model/character/CharacterData'
import { NotFoundError, RepositoryInternalError } from '@/data/error'
import { Either } from '@/shared/Either'

export interface FindCharacterByIdRepository {
  execute: (id: string) => Promise<Either<NotFoundError | RepositoryInternalError, CharacterResponse>>
}
