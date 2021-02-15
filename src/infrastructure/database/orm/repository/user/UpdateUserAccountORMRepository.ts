import { UpdateUserAccountRepository } from '@/data/repository/user/UpdateUserAccountRepository'
import { UpdateUserData } from '@/domain/model/user/UserData'
import { RepositoryInternalError } from '@/data/error'
import { Either, failure, success } from '@/shared/Either'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'
import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { Connection } from 'typeorm'
import { InvalidParamError } from '@/domain/errors'

export class UpdateUserAccountORMRepository implements UpdateUserAccountRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

  async execute (data: UpdateUserData): Promise<Either<InvalidParamError | RepositoryInternalError, void>> {
    const user = UserOrm.update(data)
    if (user.isSuccess()) {
      try {
        await this.connectionDatabase.connection()
          .createQueryBuilder()
          .update(UserOrm)
          .set(user.value)
          .where('id = :id', {
            id: data.id
          })
          .execute()
        return success()
      } catch (e) {
        return failure(new RepositoryInternalError(e))
      }
    }

    return failure(user.value)
  }
}
