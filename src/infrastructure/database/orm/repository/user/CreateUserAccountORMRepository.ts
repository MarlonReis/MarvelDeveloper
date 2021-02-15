import { CreateUserAccountRepository } from '@/data/repository/user/CreateUserAccountRepository'
import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'
import { CreateUserData } from '@/domain/model/user/UserData'
import { Either, failure, success } from '@/shared/Either'
import { RepositoryInternalError } from '@/data/error'

import { Connection } from 'typeorm'

export class CreateUserAccountORMRepository implements CreateUserAccountRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

  async execute (data: CreateUserData): Promise<Either<RepositoryInternalError, void>> {
    try {
      const user = UserOrm.create(data).value
      await this.connectionDatabase.connection()
        .createQueryBuilder()
        .insert().into(UserOrm)
        .values(user).execute()
      return success()
    } catch (error) {
      return failure(new RepositoryInternalError(error))
    }
  }
}
