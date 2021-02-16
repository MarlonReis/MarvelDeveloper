import { NotFoundError } from '@/data/error'
import { Pagination } from '@/domain/helper/Pagination'
import { CharacterResponse } from '@/domain/model/character/CharacterData'
import { Either } from '@/shared/Either'

export interface FindAllCharacterPageableRepository {
  execute: (page: number, limit: number) => Promise<Either<NotFoundError, Pagination<CharacterResponse>>>
}
