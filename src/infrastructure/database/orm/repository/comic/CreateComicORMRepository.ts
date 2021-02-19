import { CreateComicRepository } from '@/data/repository/comic/CreateComicRepository'
import {
  ConnectionDatabase
} from '@/infrastructure/database/protocol/ConnectionDatabase'

import { CreateComicData } from '@/domain/model/comic/ComicData'
import { RepositoryInternalError } from '@/data/error'
import { InvalidParamError } from '@/domain/errors'
import { Either, failure, success } from '@/shared/Either'
import { ComicOrm } from '@/infrastructure/database/orm/model/ComicOrm'

import { Connection } from 'typeorm'

export class CreateComicORMRepository implements CreateComicRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

  async execute (data: CreateComicData): Promise<Either<InvalidParamError | RepositoryInternalError, void>> {
    try {
      const comic = ComicOrm.create(data)

      if (comic.isSuccess()) {
        const comicRepository = this.connectionDatabase
          .connection().getRepository(ComicOrm)
          await comicRepository.save(comic.value)
        return success()
      }
      return failure(comic.value)
    } catch (error) {
      return failure(new RepositoryInternalError(error))
    }
  }
}
