import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'
import { DbUserFavoriteComic } from '@/data/usecase/user/DbUserFavoriteComic'
import { PinoLoggerAdapter } from '@/infrastructure/adapter'
import { Controller } from '@/presentation/protocols'
import {
  FindComicByIdORMRepository,
  UserFavoriteComicORMRepository
} from '@/infrastructure/database/orm'
import {
  UserFavoriteComicController
} from '@/presentation/controller/user/UserFavoriteComicController'

export class UserFavoriteComicFactory {
  makeControllerFactory = (): Controller => {
    const logger = new PinoLoggerAdapter()

    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()

    const userFavoriteComicRepo = new UserFavoriteComicORMRepository(connection)
    const findComicByIdRepo = new FindComicByIdORMRepository(connection)
    const dbUserFavoriteComic = new DbUserFavoriteComic(
      userFavoriteComicRepo,
      findComicByIdRepo
    )
    const controller = new UserFavoriteComicController(dbUserFavoriteComic)
    return new LogControllerDecorator(logger, controller)
  }
}
