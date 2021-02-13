import { CreateUserAccount } from '@/domain/usecase/CreateUserAccount'
import { Email, Name, Password } from '@/domain/value-object'
import { MissingParamError } from '@/presentation/error'
import { createSuccess, internalServerError, unProcessableEntity } from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

const fieldInvalid = {
  name: (value: string): boolean => {
    const nameOrError = Name.create(value)
    return nameOrError.isFailure()
  },
  email: (value: string): boolean => {
    const emailOrError = Email.create(value)
    return emailOrError.isFailure()
  },
  password: (value: string): boolean => {
    const passwordOrError = Password.create(value)
    return passwordOrError.isFailure()
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
