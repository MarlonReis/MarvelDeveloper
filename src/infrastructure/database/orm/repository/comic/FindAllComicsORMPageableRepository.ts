import { RepositoryInternalError } from '@/data/error'
import { FindAllComicsPageableRepository } from '@/data/repository/comic/FindAllComicsPageableRepository'
import { NotFoundError } from '@/domain/errors'
import { buildPagination, Pagination, paginationParams } from '@/domain/helper/Pagination'
import { ComicResponse } from '@/domain/model/comic/ComicData'
import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { Either, failure, success } from '@/shared/Either'
import { Connection } from 'typeorm'
import { ComicOrm } from '@/infrastructure/database/orm/model/ComicOrm'

export class FindAllComicsORMPageableRepository implements FindAllComicsPageableRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

  async execute (page: number, limit: number): Promise<Either<NotFoundError, Pagination<ComicResponse>>> {
    try {
      const repository = this.connectionDatabase.connection().getRepository(ComicOrm)
      const count = await repository.count()

      const { skip, take, maxPages, prevPage, nextPage } = paginationParams(page, limit, count)

      const data = await repository.find({ skip, take })

      return success(buildPagination(page, maxPages, count, prevPage, nextPage, data))
    } catch (error) {
      return failure(new RepositoryInternalError(error))
    }
  }
}
