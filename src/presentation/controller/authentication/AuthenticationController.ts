import { AuthDataValidation } from '@/domain/model/user/AuthenticationData'
import { Authentication } from '@/domain/usecase/authentication/Authentication'
import { badRequest, internalServerError, ok, unProcessableEntity } from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class AuthenticationController implements Controller {
  private readonly authentication: Authentication

  constructor (auth: Authentication) {
    this.authentication = auth
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const requiredField = ['email', 'password']

    if (!request.body) {
      return badRequest('Attributes \'email\' and \'password\'  is required!')
    }

    for (const field of requiredField) {
      const value = AuthDataValidation[field](request.body[field])
      if (value.isFailure()) {
        return unProcessableEntity(value.value)
      }
    }

    const response = await this.authentication.execute(request.body)
    if (response.isSuccess()) {
      return ok({ token: `Bearer ${response.value}` })
    }

    return internalServerError(response.value)
  }
}
