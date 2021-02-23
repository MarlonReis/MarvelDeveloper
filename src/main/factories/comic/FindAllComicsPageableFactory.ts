import { DbFindAllComicsPageable } from '@/data/usecase/comic/DbFindAllComicsPageable'
import { PinoLoggerAdapter } from '@/infrastructure/adapter'
import { FindAllComicsORMPageableRepository } from '@/infrastructure/database/orm'
import { Controller } from '@/presentation/protocols'
import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'
import { FindAllComicsPageableController } from '@/presentation/controller/comic/FindAllComicsPageableController'

export class FindAllComicsPageableFactory {
  makeControllerFactory (): Controller {
    const logger = new PinoLoggerAdapter()

    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()

    const findAllRepo = new FindAllComicsORMPageableRepository(connection)
    const dbFindAll = new DbFindAllComicsPageable(findAllRepo)

    const controller = new FindAllComicsPageableController(dbFindAll)

    return new LogControllerDecorator(logger, controller)
  }
}
//
