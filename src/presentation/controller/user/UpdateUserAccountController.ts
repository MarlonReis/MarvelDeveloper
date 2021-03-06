import { ValidateUpdateData } from '@/domain/model/user/UserData'
import { UpdateUserAccount } from '@/domain/usecase/user/UpdateUserAccount'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'
import {
  MissingParamError
} from '@/presentation/error'
import {
  internalServerError,
  unProcessableEntity,
  ok, customError, badRequest
} from '@/presentation/helper'
import { DuplicatePropertyError } from '@/data/error'
import { NotFoundError } from '@/domain/errors'

export class UpdateUserAccountController implements Controller {
  private readonly updateUserAccount: UpdateUserAccount

  constructor (updateUserAccount: UpdateUserAccount) {
    this.updateUserAccount = updateUserAccount
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { id } = req.authenticatedUserData ?? {}

    if (!id) {
      return unProcessableEntity(new MissingParamError('id'))
    }

    for (const field of Object.keys(req.body)) {
      const response = ValidateUpdateData[field](req.body[field])
      if (response.isFailure()) {
        return unProcessableEntity(response.value)
      }
    }
    const response = await this.updateUserAccount.execute({
      ...req.body, id
    })

    if (response.isSuccess()) {
      return ok()
    }

    if (response.value instanceof NotFoundError) {
      return customError(404, response.value)
    }

    if (response.value instanceof DuplicatePropertyError) {
      return badRequest(response.value.message)
    }

    return internalServerError(response.value)
  }
}
