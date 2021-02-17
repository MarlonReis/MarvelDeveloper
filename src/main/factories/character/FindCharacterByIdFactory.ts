import { FindCharacterByIdController } from '@/presentation/controller/character/FindCharacterByIdController'
import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'
import { FindCharacterByIdORMRepository } from '@/infrastructure/database/orm'
import { PinoLoggerAdapter } from '@/infrastructure/adapter'
import { Controller } from '@/presentation/protocols'

export class FindCharacterByIdFactory {
  makeControllerFactory (): Controller {
    const logger = new PinoLoggerAdapter()

    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()
    const repository = new FindCharacterByIdORMRepository(connection)
    const controller = new FindCharacterByIdController(repository)

    return new LogControllerDecorator(logger, controller)
  }
}
