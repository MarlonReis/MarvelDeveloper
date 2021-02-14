import { NotFoundError } from '@/data/error'
import { FindUserAccountByIdRepository } from '@/data/repository/FindUserAccountByIdRepository'
import { UserAccountResponse } from '@/domain/model/user/UserData'
import { Either, failure, success } from '@/shared/Either'

import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'

import { Connection } from 'typeorm'
import { UserOrm } from '../model/UserOrm'

export class FindUserAccountByIdORMRepository implements FindUserAccountByIdRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

  async execute (id: string): Promise<Either<NotFoundError, UserAccountResponse>> {
    const user = await this.connectionDatabase
      .connection().getRepository(UserOrm)
      .createQueryBuilder('users')
      .where('users.id = :id', { id })
      .getOne()

    if (user) {
      return success({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        profileImage: user.profileImage
      })
    }
    return failure(new NotFoundError(`Cannot found account by id equals '${id}'!`))
  }
}
