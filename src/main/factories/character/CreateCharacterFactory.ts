import { CreateCharacterController } from '@/presentation/controller/character/CreateCharacterController'
import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'
import { DbCreateCharacter } from '@/data/usecase/character/DbCreateCharacter'
import { CreateCharacterORMRepository } from '@/infrastructure/database/orm'
import { PinoLoggerAdapter } from '@/infrastructure/adapter'
import { Controller } from '@/presentation/protocols'

export class CreateCharacterFactory {
  makeControllerFactory (): Controller {
    const logger = new PinoLoggerAdapter()

    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()
    const repository = new CreateCharacterORMRepository(connection)
    const createCharacter = new DbCreateCharacter(repository)
    const controller = new CreateCharacterController(createCharacter)

    return new LogControllerDecorator(logger, controller)
  }
}
