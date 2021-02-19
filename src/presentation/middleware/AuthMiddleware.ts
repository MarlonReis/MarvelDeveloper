import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols'
import { forbidden } from '@/presentation/helper'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden()
  }
}
