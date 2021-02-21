import { RepositoryInternalError } from '@/data/error'
import { NotFoundError } from '@/domain/errors'
import { FindComicByIdRepository } from '@/data/repository/comic/FindComicByIdRepository'
import { buildComicResponse, ComicResponse } from '@/domain/model/comic/ComicData'
import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { Either, failure, success } from '@/shared/Either'
import { Connection } from 'typeorm'
import { ComicOrm } from '@/infrastructure/database/orm/model/ComicOrm'

export class FindComicByIdORMRepository implements FindComicByIdRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

  async execute (id: string): Promise<Either<NotFoundError | RepositoryInternalError, ComicResponse>> {
    try {
      const comic = await this.connectionDatabase.connection()
        .getRepository(ComicOrm)
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.characters', 'characters')
        .where('users.id = :id', { id })
        .getOne()

      if (comic) {
        return success(buildComicResponse(comic))
      }
      return failure(new NotFoundError(`Cannot found comic by id equals '${id}'!`))
    } catch (error) {
      return failure(new RepositoryInternalError(error))
    }
  }
}
