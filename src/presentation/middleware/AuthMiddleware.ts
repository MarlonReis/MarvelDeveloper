import { FindUserAccountByTokenData } from '@/domain/usecase/authentication/FindUserAccountByTokenData'
import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols'
import { forbidden, internalServerError, ok } from '@/presentation/helper'
import { Role } from '@/domain/model/user/AuthenticationData'
import { DecryptError } from '@/data/error'
import { NotFoundError } from '@/domain/errors'

export class AuthMiddleware implements Middleware {
  private readonly findUserAccountByTokenData: FindUserAccountByTokenData
  private readonly role: Role

  constructor (
    findByToken: FindUserAccountByTokenData,
    role: Role = Role.USER) {
    this.findUserAccountByTokenData = findByToken
    this.role = role
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const token = request.headers.authentication

    if (token) {
      const response = await this.findUserAccountByTokenData.execute(token, this.role)

      if (response.isSuccess()) {
        return ok(response.value)
      }

      if ((response.value instanceof DecryptError) ||
        (response.value instanceof NotFoundError)) {
        return forbidden()
      }

      return internalServerError(response.value)
    }
    return forbidden()
  }
}
