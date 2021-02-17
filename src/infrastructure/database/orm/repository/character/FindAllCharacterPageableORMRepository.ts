import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { CharacterOrm } from '@/infrastructure/database/orm/model/CharacterOrm'
import { CharacterResponse } from '@/domain/model/character/CharacterData'
import { Pagination, paginationParams, buildPagination } from '@/domain/helper/Pagination'
import { Either, success } from '@/shared/Either'
import { NotFoundError } from '@/data/error'
import {
  FindAllCharacterPageableRepository
} from '@/data/repository/character/FindAllCharacterPageableRepository'

import { Connection } from 'typeorm'

export class FindAllCharacterPageableORMRepository implements FindAllCharacterPageableRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

  async execute (page: number = 1, limit: number = 10): Promise<Either<NotFoundError, Pagination<CharacterResponse>>> {
    const repository = this.connectionDatabase.connection().getRepository(CharacterOrm)

    const count = await repository.count()
    const { skip, take, maxPages, prevPage, nextPage } = paginationParams(page, limit, count)
    const data = await repository.find({ skip, take })

    return success(buildPagination(page, maxPages, count, prevPage, nextPage, data))
  }
}
