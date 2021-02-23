import { PinoLoggerAdapter } from '@/infrastructure/adapter'
import { Controller } from '@/presentation/protocols'
import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import { DbFindAllUserFavoriteComicsPageable } from '@/data/usecase/user/DbFindAllUserFavoriteComicsPageable'
import { FindAllUserFavoriteComicsPageableController } from '@/presentation/controller/user/FindAllUserFavoriteComicsPageableController'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'
import {
  FindAllUserFavoriteComicsPageableORMRepository
} from '@/infrastructure/database/orm'

export class FindAllUserFavoriteComicsPageableFactory {
  makeControllerFactory = (): Controller => {
    const logger = new PinoLoggerAdapter()

    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()

    const repository = new FindAllUserFavoriteComicsPageableORMRepository(connection)
    const dbFindAll = new DbFindAllUserFavoriteComicsPageable(repository)

    const controller = new FindAllUserFavoriteComicsPageableController(dbFindAll)

    return new LogControllerDecorator(logger, controller)
  }
}
