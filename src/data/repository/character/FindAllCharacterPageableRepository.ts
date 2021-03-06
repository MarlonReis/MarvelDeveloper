import { CharacterResponse } from '@/domain/model/character/CharacterData'
import { Pagination } from '@/domain/helper/Pagination'
import { NotFoundError } from '@/domain/errors'
import { Either } from '@/shared/Either'

export interface FindAllCharacterPageableRepository {
  execute: (page: number, limit: number) => Promise<Either<NotFoundError, Pagination<CharacterResponse>>>
}
