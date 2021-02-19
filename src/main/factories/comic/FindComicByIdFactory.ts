import { FindComicByIdController } from '@/presentation/controller/comic/FindComicByIdController'
import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'
import { FindComicByIdORMRepository } from '@/infrastructure/database/orm'
import { DbFindComicById } from '@/data/usecase/comic/DbFindComicById'
import { PinoLoggerAdapter } from '@/infrastructure/adapter'
import { Controller } from '@/presentation/protocols'

export class FindComicByIdFactory {
  makeControllerFactory (): Controller {
    const logger = new PinoLoggerAdapter()

    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()
    const findComicByIdRepo = new FindComicByIdORMRepository(connection)
    const findComicById = new DbFindComicById(findComicByIdRepo)
    const controller = new FindComicByIdController(findComicById)

    return new LogControllerDecorator(logger, controller)
  }
}
