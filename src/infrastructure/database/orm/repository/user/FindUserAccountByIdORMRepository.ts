import { RepositoryInternalError } from '@/data/error'
import { NotFoundError } from '@/domain/errors'
import {
  FindUserAccountByIdRepository
} from '@/data/repository/user/FindUserAccountByIdRepository'
import { UserAccountResponse } from '@/domain/model/user/UserData'
import { Either, failure, success } from '@/shared/Either'

import {
  ConnectionDatabase
} from '@/infrastructure/database/protocol/ConnectionDatabase'

import { Connection } from 'typeorm'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'

export class FindUserAccountByIdORMRepository implements FindUserAccountByIdRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

  async execute (id: string): Promise<Either<NotFoundError | RepositoryInternalError, UserAccountResponse>> {
    try {
      const user = await this.connectionDatabase.connection().getRepository(UserOrm)
        .createQueryBuilder('users')
        .where('users.id = :id', { id })
        .getOne()

      if (user) {
        return success({
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
          role: user.role,
          profileImage: user.profileImage
        })
      }
      return failure(new NotFoundError(`Cannot found account by id equals '${id}'!`))
    } catch (error) {
      return failure(new RepositoryInternalError(error))
    }
  }
}
