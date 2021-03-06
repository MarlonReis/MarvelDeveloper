import { DbFindUserAccountByTokenData } from '@/data/usecase/authentication/DbFindUserAccountByTokenData'
import { ExpressMiddlewareAdapter } from '@/main/express/adapter/ExpressMiddlewareAdapter'
import { EnvironmentConfiguration } from '@/infrastructure/util/EnvironmentConfiguration'
import { ConnectionDatabaseFactory } from '@/main/factories/ConnectionDatabaseFactory'
import { FindUserAccountByIdORMRepository } from '@/infrastructure/database/orm'
import { AuthMiddleware } from '@/presentation/middleware/AuthMiddleware'
import { JwtDecryptAuthTokenAdapter } from '@/infrastructure/adapter'
import { Role } from '@/domain/model/user/AuthenticationData'

export class AuthenticationMiddleware {
  makeMiddlewareFactory (role: Role): any {
    const secretKey = EnvironmentConfiguration.authenticationSecretKey()
    const connection = new ConnectionDatabaseFactory().makeConnectionFactory()

    const findByIdORMRepo = new FindUserAccountByIdORMRepository(connection)
    const jwtDecryptAuthToken = new JwtDecryptAuthTokenAdapter(secretKey)

    const findUByTokenData = new DbFindUserAccountByTokenData(
      jwtDecryptAuthToken, findByIdORMRepo, role
    )

    return ExpressMiddlewareAdapter(new AuthMiddleware(findUByTokenData))
  }
}
