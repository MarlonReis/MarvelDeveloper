import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'
import { DbCreateComic } from '@/data/usecase/comic/DbCreateComic'
import { PinoLoggerAdapter } from '@/infrastructure/adapter'
import { Controller } from '@/presentation/protocols'
import {
  CreateComicORMRepository,
  FindCharacterByIdORMRepository
} from '@/infrastructure/database/orm'

import {
  CreateComicController
} from '@/presentation/controller/comic/CreateComicController'

export class CreateComicFactory {
  makeControllerFactory (): Controller {
    const logger = new PinoLoggerAdapter()

    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()
    const createComicRepo = new CreateComicORMRepository(connection)
    const findCharacterByIdRepo = new FindCharacterByIdORMRepository(connection)
    const createComic = new DbCreateComic(createComicRepo, findCharacterByIdRepo)

    const controller = new CreateComicController(createComic)

    return new LogControllerDecorator(logger, controller)
  }
}
