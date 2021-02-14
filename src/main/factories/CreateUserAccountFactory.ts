
import {
  CreateUserAccountORMRepository,
  FindUserAccountByEmailORMRepository
} from '@/infrastructure/database/orm'

import { ConnectionDatabaseFactory } from './ConnectionDatabaseFactory'
import { BCryptEncryptsPasswordAdapter, PinoLoggerAdapter } from '@/infrastructure/adapter'
import { DbCreateUserAccount } from '@/data/usecase/DbCreateUserAccount'
import { Controller } from '@/presentation/protocols'
import {
  CreateUserAccountController
} from '@/presentation/controller/CreateUserAccountController'
import { LogControllerDecorator } from './LogControllerDecorator'

export class CreateUserAccountFactory {
  makeCreateUserAccountFactory (): DbCreateUserAccount {
    const salt = 12

    const encryptsPassword = new BCryptEncryptsPasswordAdapter(salt)
    const connection = new ConnectionDatabaseFactory()
      .makeConnectionFactory()
    const createUserAccountRepo = new CreateUserAccountORMRepository(connection)
    const findUserAccountByEmailRepo = new FindUserAccountByEmailORMRepository(connection)

    return new DbCreateUserAccount(
      createUserAccountRepo,
      findUserAccountByEmailRepo,
      encryptsPassword
    )
  }

  makeControllerFactory = (): Controller => {
    const logger = new PinoLoggerAdapter()
    const createUserAccount = this.makeCreateUserAccountFactory()
    const controller = new CreateUserAccountController(createUserAccount)
    return new LogControllerDecorator(logger, controller)
  }
}
