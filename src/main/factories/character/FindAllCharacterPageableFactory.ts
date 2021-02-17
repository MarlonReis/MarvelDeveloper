import { PinoLoggerAdapter } from '@/infrastructure/adapter'
import { Controller } from '@/presentation/protocols'
import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import { FindAllCharacterPageableORMRepository } from '@/infrastructure/database/orm'
import { DbFindAllCharacterPageable } from '@/data/usecase/character/DbFindAllCharacterPageable'
import { FindAllCharacterPageableController } from '@/presentation/controller/character/FindAllCharacterPageableController'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'

export class FindAllCharacterPageableFactory {
  makeControllerFactory (): Controller {
    const logger = new PinoLoggerAdapter()

    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()
    const repository = new FindAllCharacterPageableORMRepository(connection)
    const findAllCharacterPageable = new DbFindAllCharacterPageable(repository)
    const controller = new FindAllCharacterPageableController(findAllCharacterPageable)

    return new LogControllerDecorator(logger, controller)
  }
}
