import { NotFoundError } from '@/domain/errors'
import { FindAllCharacterPageableRepository } from '@/data/repository/character/FindAllCharacterPageableRepository'
import { Pagination } from '@/domain/helper/Pagination'
import { CharacterResponse } from '@/domain/model/character/CharacterData'
import { FindAllCharacterPageable } from '@/domain/usecase/character/FindAllCharacterPageable'
import { Either } from '@/shared/Either'

export class DbFindAllCharacterPageable implements FindAllCharacterPageable {
  private readonly findAllCharacterPageableRepo: FindAllCharacterPageableRepository

  constructor (repo: FindAllCharacterPageableRepository) {
    this.findAllCharacterPageableRepo = repo
  }

  async execute (page: number, limit: number): Promise<Either<NotFoundError, Pagination<CharacterResponse>>> {
    return await this.findAllCharacterPageableRepo.execute(page, limit)
  }
}
