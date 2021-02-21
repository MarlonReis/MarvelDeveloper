import { FindUserAccountByTokenData } from '@/domain/usecase/authentication/FindUserAccountByTokenData'
import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols'
import { forbidden, internalServerError, ok } from '@/presentation/helper'
import { DecryptError } from '@/data/error'
import { NotFoundError, UnauthorizedAccessError } from '@/domain/errors'

const containsErrorForbidden = (value: any): boolean => {
  const errorForbidden = [UnauthorizedAccessError, DecryptError, NotFoundError]
  for (const err of errorForbidden) {
    if (value instanceof err) {
      return true
    }
  }
  return false
}

export class AuthMiddleware implements Middleware {
  private readonly findUserAccountByTokenData: FindUserAccountByTokenData

  constructor (findByToken: FindUserAccountByTokenData) {
    this.findUserAccountByTokenData = findByToken
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const token = request.headers.authentication

    if (token) {
      const response = await this.findUserAccountByTokenData.execute(token)

      if (response.isSuccess()) {
        return ok(response.value)
      }

      if (containsErrorForbidden(response.value)) {
        return forbidden()
      }

      return internalServerError(response.value)
    }
    return forbidden()
  }
}
