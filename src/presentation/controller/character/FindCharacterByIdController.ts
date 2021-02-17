import { FindCharacterById } from '@/domain/usecase/character/FindCharacterById'
import { IdEntity } from '@/domain/value-object'
import { badRequest, internalServerError, ok } from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

const isInvalidParam = (req: HttpRequest): boolean => {
  if ('params' in req && 'id' in req.params) {
    return IdEntity.create(req.params.id).isFailure()
  }
  return true
}

export class FindCharacterByIdController implements Controller {
  private readonly findCharacterById: FindCharacterById

  constructor (findCharacterById: FindCharacterById) {
    this.findCharacterById = findCharacterById
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (isInvalidParam(httpRequest)) {
      return badRequest("Attribute 'id' is invalid!")
    }

    const { id } = httpRequest.params

    const response = await this.findCharacterById.execute(id)
    if (response.isSuccess()) {
      return ok(response.value)
    }
    return internalServerError(response.value)
  }
}
