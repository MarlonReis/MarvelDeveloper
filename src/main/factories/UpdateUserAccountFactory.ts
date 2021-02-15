import { DbUpdateUserAccount } from '@/data/usecase/user/DbUpdateUserAccount'
import { PinoLoggerAdapter } from '@/infrastructure/adapter'
import {
  FindUserAccountByEmailORMRepository,
  FindUserAccountByIdORMRepository,
  UpdateUserAccountORMRepository
} from '@/infrastructure/database/orm'

import {
  UpdateUserAccountController
} from '@/presentation/controller/UpdateUserAccountController'
import { Controller } from '@/presentation/protocols'
import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'
import { EncryptsPasswordFactory } from '@/main/factories/EncryptsPasswordFactory'

export class UpdateUserAccountFactory {
  makeUpdateUserAccountFactory (): DbUpdateUserAccount {
    const encryptsPassword = new EncryptsPasswordFactory().makeFactory()
    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()

    const findUserAccountByEmailRepo = new FindUserAccountByEmailORMRepository(connection)
    const findUserAccountByIdRepo = new FindUserAccountByIdORMRepository(connection)
    const updateUserAccountRepo = new UpdateUserAccountORMRepository(connection)

    return new DbUpdateUserAccount(
      updateUserAccountRepo,
      findUserAccountByEmailRepo,
      findUserAccountByIdRepo,
      encryptsPassword
    )
  }

  makeControllerFactory = (): Controller => {
    const logger = new PinoLoggerAdapter()
    const updateUserAccount = this.makeUpdateUserAccountFactory()
    const controller = new UpdateUserAccountController(updateUserAccount)
    return new LogControllerDecorator(logger, controller)
  }
}
