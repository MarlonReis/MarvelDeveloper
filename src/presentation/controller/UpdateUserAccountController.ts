import { ValidateUpdateData } from '@/domain/model/user/UserData'
import { UpdateUserAccount } from '@/domain/usecase/UpdateUserAccount'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { MissingParamError } from '../error'
import { unProcessableEntity } from '../helper'

export class UpdateUserAccountController implements Controller {
  private readonly updateUserAccount: UpdateUserAccount

  constructor (updateUserAccount: UpdateUserAccount) {
    this.updateUserAccount = updateUserAccount
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    if (!('id' in req.body)) {
      return unProcessableEntity(new MissingParamError('id'))
    }

    for (const field of Object.keys(req.body)) {
      const response = ValidateUpdateData[field](req.body[field])
      if (response.isFailure()) {
        return unProcessableEntity(response.value)
      }
    }
    const response = await this.updateUserAccount.execute(req.body)

    if (response.isSuccess()) {
      return await Promise.resolve({ statusCode: 200 })
    }
  }
}
