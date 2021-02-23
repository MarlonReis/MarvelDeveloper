import { PinoLoggerAdapter } from '@/infrastructure/adapter'
import { Controller } from '@/presentation/protocols'
import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import {
  UserDisfavorComicController
} from '@/presentation/controller/user/UserDisfavorComicController'
import { UserDisfavorComicORMRepository } from '@/infrastructure/database/orm'
import { DbUserDisfavorComic } from '@/data/usecase/user/DbUserDisfavorComic'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'

export class UserDisfavorComicFactory {
  makeControllerFactory = (): Controller => {
    const logger = new PinoLoggerAdapter()

    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()

    const repository = new UserDisfavorComicORMRepository(connection)

    const dbUserDisfavorComic = new DbUserDisfavorComic(repository)

    const controller = new UserDisfavorComicController(dbUserDisfavorComic)
    return new LogControllerDecorator(logger, controller)
  }
}
