import { FindUserAccountByTokenData } from '@/domain/usecase/user/FindUserAccountByTokenData'
import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols'
import { forbidden, internalServerError, ok } from '@/presentation/helper'
import { NotFoundError } from '@/data/error'

export class AuthMiddleware implements Middleware {
  private readonly findUserAccountByTokenData: FindUserAccountByTokenData

  constructor (findByToken: FindUserAccountByTokenData) {
    this.findUserAccountByTokenData = findByToken
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const token = request.headers.Authentication
    if (token) {
      const response = await this.findUserAccountByTokenData.execute(token)
      if (response.isSuccess()) {
        return ok(response.value)
      }

      if (!(response.value instanceof NotFoundError)) {
        return internalServerError(response.value)
      }
    }
    return forbidden()
  }
}
