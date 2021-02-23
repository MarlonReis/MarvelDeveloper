import { RepositoryInternalError } from '@/data/error'
import { FindAllUserFavoriteComicsPageableRepository } from '@/data/repository/user/FindAllUserFavoriteComicsPageableRepository'
import { buildPagination, Pagination, paginationParams } from '@/domain/helper/Pagination'
import { ComicResponse } from '@/domain/model/comic/ComicData'
import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { Either, failure, success } from '@/shared/Either'

import { Connection } from 'typeorm'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'

export class FindAllUserFavoriteComicsPageableORMRepository implements FindAllUserFavoriteComicsPageableRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

  async execute (userId: string, page: number = 0, limit: number = 10): Promise<Either<RepositoryInternalError, Pagination<ComicResponse>>> {
    try {
      const query = await this.connectionDatabase.connection()
        .getRepository(UserOrm)
        .createQueryBuilder('users')
        .innerJoinAndSelect('users.favoriteComics', 'favoriteComics')
        .where('users.id = :id', { id: userId })

      const count = await query.getCount()
      const { skip, take, maxPages, prevPage, nextPage } = paginationParams(page, limit, count)

      const response = await query.skip(skip).take(take).getOne()
      const data = response ? response.favoriteComics : []

      return success(buildPagination(page, maxPages, count, prevPage, nextPage, data))
    } catch (error) {
      return failure(new RepositoryInternalError(error))
    }
  }
}
