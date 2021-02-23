import {
  FindAllUserFavoriteComicsPageableRepository
} from '@/data/repository/user/FindAllUserFavoriteComicsPageableRepository'
import { NotFoundError } from '@/domain/errors'
import { Pagination } from '@/domain/helper/Pagination'
import { ComicResponse } from '@/domain/model/comic/ComicData'
import {
  FindAllUserFavoriteComicsPageable
} from '@/domain/usecase/user/FindAllUserFavoriteComicsPageable'
import { Either, failure, success } from '@/shared/Either'

export class DbFindAllUserFavoriteComicsPageable implements FindAllUserFavoriteComicsPageable {
  private readonly findAllRepo: FindAllUserFavoriteComicsPageableRepository

  constructor (repo: FindAllUserFavoriteComicsPageableRepository) {
    this.findAllRepo = repo
  }

  async execute (userId: string, page: number, limit: number): Promise<Either<NotFoundError, Pagination<ComicResponse>>> {
    const response = await this.findAllRepo.execute(userId, page, limit)
    if (response.isSuccess()) {
      return success(response.value)
    }
    return failure(response.value)
  }
}
