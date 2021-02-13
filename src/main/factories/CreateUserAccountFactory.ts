
import {
  CreateUserAccountORMRepository,
  FindUserAccountByEmailORMRepository
} from '@/infrastructure/database/orm'

import { ConnectionDatabaseFactory } from './ConnectionDatabaseFactory'
import { BCryptEncryptsPasswordAdapter } from '@/infrastructure/adapter'
import { DbCreateUserAccount } from '@/data/usecase/DbCreateUserAccount'

export class CreateUserAccountFactory {
   makeCreateUserAccountFactory (): DbCreateUserAccount {
    const salt = 12

    const encryptsPassword = new BCryptEncryptsPasswordAdapter(salt)
    const connection = ConnectionDatabaseFactory.makeConnectionFactory()
    const createUserAccountRepo = new CreateUserAccountORMRepository(connection)
    const findUserAccountByEmailRepo = new FindUserAccountByEmailORMRepository(connection)

    return new DbCreateUserAccount(
      createUserAccountRepo,
      findUserAccountByEmailRepo,
      encryptsPassword
    )
  }
}
