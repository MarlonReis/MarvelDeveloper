import { FindAllComicsPageableRepository } from '@/data/repository/comic/FindAllComicsPageableRepository'
import { NotFoundError } from '@/domain/errors'
import { Pagination } from '@/domain/helper/Pagination'
import { ComicResponse } from '@/domain/model/comic/ComicData'
import { FindAllComicsPageable } from '@/domain/usecase/comic/FindAllComicsPageable'
import { Either, failure, success } from '@/shared/Either'

export class DbFindAllComicsPageable implements FindAllComicsPageable {
  private readonly findAllComicsPageableRepo: FindAllComicsPageableRepository

  constructor (repo: FindAllComicsPageableRepository) {
    this.findAllComicsPageableRepo = repo
  }

  async execute (page: number, limit: number): Promise<Either<NotFoundError, Pagination<ComicResponse>>> {
    const response = await this.findAllComicsPageableRepo.execute(page, limit)
    if (response.isSuccess()) {
      return success(response.value)
    }
    return failure(response.value)
  }
}
