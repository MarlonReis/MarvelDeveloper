
import {
  CreateUserAccountORMRepository,
  FindUserAccountByEmailORMRepository
} from '@/infrastructure/database/orm'

import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import { PinoLoggerAdapter } from '@/infrastructure/adapter'
import { DbCreateUserAccount } from '@/data/usecase/user/DbCreateUserAccount'
import { Controller } from '@/presentation/protocols'
import {
  CreateUserAccountController
} from '@/presentation/controller/user/CreateUserAccountController'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'
import { EncryptsPasswordFactory } from '@/main/factories/EncryptsPasswordFactory'

export class CreateUserAccountFactory {
  makeCreateUserAccountFactory (): DbCreateUserAccount {
    const encryptsPassword = new EncryptsPasswordFactory().makeFactory()
    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()
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
