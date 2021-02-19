import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols'
import { forbidden } from '@/presentation/helper'
import { FindUserAccountByTokenData } from '@/domain/usecase/user/FindUserAccountByTokenData'

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
        console.log(response.value)
      }
    }
    return forbidden()
  }
}
