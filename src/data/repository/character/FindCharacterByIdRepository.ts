import { CharacterResponse } from '@/domain/model/character/CharacterData'
import { RepositoryInternalError } from '@/data/error'
import { NotFoundError } from '@/domain/errors'
import { Either } from '@/shared/Either'

export interface FindCharacterByIdRepository {
  execute: (id: string) => Promise<Either<NotFoundError | RepositoryInternalError, CharacterResponse>>
}
