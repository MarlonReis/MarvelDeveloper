import { DbFindUserAccountByTokenData } from '@/data/usecase/authentication/DbFindUserAccountByTokenData'
import { EnvironmentConfiguration } from '@/infrastructure/util/EnvironmentConfiguration'
import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import { FindUserAccountByIdORMRepository } from '@/infrastructure/database/orm'
import { AuthMiddleware } from '@/presentation/middleware/AuthMiddleware'
import { JwtDecryptAuthTokenAdapter } from '@/infrastructure/adapter'
import { Role } from '@/domain/model/user/AuthenticationData'
import { Middleware } from '@/presentation/protocols'

export class AuthenticationMiddleware {
 // TODO:: add role in use case
  makeMiddlewareFactory (role: Role): Middleware {
    const secretKey = EnvironmentConfiguration.authenticationSecretKey()
    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()

    const findByIdORMRepo = new FindUserAccountByIdORMRepository(connection)
    const jwtDecryptAuthToken = new JwtDecryptAuthTokenAdapter(secretKey)

    const findUByTokenData = new DbFindUserAccountByTokenData(jwtDecryptAuthToken, findByIdORMRepo)

    return new AuthMiddleware(findUByTokenData)
  }
}
