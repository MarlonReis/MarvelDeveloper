import { FindCharacterById } from '@/domain/usecase/character/FindCharacterById'
import { IdEntity } from '@/domain/value-object'
import { badRequest, internalServerError, ok } from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class FindCharacterByIdController implements Controller {
  private readonly findCharacterById: FindCharacterById

  constructor (findCharacterById: FindCharacterById) {
    this.findCharacterById = findCharacterById
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.params

    const characterId = IdEntity.create(id)
    if (characterId.isFailure()) {
      return badRequest("Attribute 'id' is invalid!")
    }

    const response = await this.findCharacterById.execute(id)
    if (response.isSuccess()) {
      return ok(response.value)
    }
    return internalServerError(response.value)
  }
}
