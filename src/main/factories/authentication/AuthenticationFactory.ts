import { DbAuthentication } from '@/data/usecase/authentication/DbAuthentication'
import {
  BCryptComparePasswordAdapter, JwtAdapter, PinoLoggerAdapter
} from '@/infrastructure/adapter'
import { FindUserAccountByEmailORMRepository } from '@/infrastructure/database/orm'
import { EnvironmentConfiguration } from '@/infrastructure/util/EnvironmentConfiguration'
import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import {
  AuthenticationController
} from '@/presentation/controller/authentication/AuthenticationController'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'
import { Controller } from '@/presentation/protocols'

export class AuthenticationFactory {
  private makeAuthenticationFactory (): DbAuthentication {
    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()
    const secretKey = EnvironmentConfiguration.authenticationSecretKey()
    const findUserAccountByEmailRepo = new FindUserAccountByEmailORMRepository(connection)
    const comparePassword = new BCryptComparePasswordAdapter()
    const tokenGenerator = new JwtAdapter(secretKey)

    return new DbAuthentication(findUserAccountByEmailRepo, comparePassword, tokenGenerator)
  }

  makeControllerFactory (): Controller {
    const logger = new PinoLoggerAdapter()
    const authentication = this.makeAuthenticationFactory()
    const controller = new AuthenticationController(authentication)
    return new LogControllerDecorator(logger, controller)
  }
}
