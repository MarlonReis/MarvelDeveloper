import { CharacterResponse } from '@/domain/model/character/CharacterData'
import { Pagination } from '@/domain/healper/Pagination'
import { NotFoundError } from '@/data/error'
import { Either } from '@/shared/Either'

export interface FindAllCharacterPageable {
  execute: (page: number, limit: number) => Promise<Either<NotFoundError, Pagination<CharacterResponse>>>
}
