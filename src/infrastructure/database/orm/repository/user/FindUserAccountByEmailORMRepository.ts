import { NotFoundError, RepositoryInternalError } from '@/data/error'
import {
  FindUserAccountByEmailRepository
} from '@/data/repository/user/FindUserAccountByEmailRepository'
import { UserAccountResponse } from '@/domain/model/user/UserData'
import { Either, failure, success } from '@/shared/Either'
import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'

import { Connection } from 'typeorm'

export class FindUserAccountByEmailORMRepository
  implements FindUserAccountByEmailRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

  async execute (email: string): Promise<Either<NotFoundError | RepositoryInternalError, UserAccountResponse>> {
    try {
      const user = await this.connectionDatabase
        .connection().getRepository(UserOrm)
        .createQueryBuilder('users')
        .where('users.email = :email', { email })
        .getOne()

      if (user) {
        return success({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          status: user.status
        })
      }
      return failure(new NotFoundError(`Cannot found account by email equals '${email}'!`))
    } catch (err) {
      return failure(new RepositoryInternalError(err))
    }
  }
}
