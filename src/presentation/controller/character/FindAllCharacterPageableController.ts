import { FindAllCharacterPageable } from '@/domain/usecase/character/FindAllCharacterPageable'
import { internalServerError, ok } from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class FindAllCharacterPageableController implements Controller {
  private readonly findAllCharacterPageable: FindAllCharacterPageable

  constructor (findAllCharacterPageable: FindAllCharacterPageable) {
    this.findAllCharacterPageable = findAllCharacterPageable
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { page, perPage } = request.query

    const response = await this.findAllCharacterPageable.execute(page, perPage)
    if (response.isSuccess()) {
      return ok(response.value)
    }
    return internalServerError(response.value)
  }
}
