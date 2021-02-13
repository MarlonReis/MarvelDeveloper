import { CreateUserAccount } from '@/domain/usecase/CreateUserAccount'
import { MissingParamError } from '@/presentation/error'
import { createSuccess, internalServerError, unProcessableEntity } from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const fieldInvalid = {
    name: (value: string): boolean => {
        if (value && /.{3,}/.test(value)) {
            return false
        }
        return true
    },
    email: (value: string): boolean => {
        if (value && emailRegex.test(value)) {
            return false
        }
        return true
    },
    password: (value: string): boolean => {
        if (value && /.{8,}/.test(value)) {
            return false
        }
        return true
    }
}

export class CreateUserAccountController implements Controller {
  private readonly createUserAccount: CreateUserAccount

  constructor (createUserAccountUseCase: CreateUserAccount) {
    this.createUserAccount = createUserAccountUseCase
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      const value = request.body[field]
      if (fieldInvalid[field](value)) {
        return unProcessableEntity(new MissingParamError(field))
      }
    }

    const response = await this.createUserAccount.execute(request.body)
    if (response.isSuccess()) {
      return await Promise.resolve(createSuccess())
    }

    return internalServerError(response.value)
  }
}
