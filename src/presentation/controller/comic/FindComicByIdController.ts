import { NotFoundError } from '@/data/error'
import { FindComicById } from '@/domain/usecase/comic/FindComicById'
import { customError, internalServerError, ok } from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class FindComicByIdController implements Controller {
  private readonly findComicById: FindComicById

  constructor (findComicById: FindComicById) {
    this.findComicById = findComicById
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { id } = request.params

    const response = await this.findComicById.execute(id)
    if (response.isSuccess()) {
      return ok(response.value)
    }

    if (response.value instanceof NotFoundError) {
      return customError(404, response.value)
    }

    return internalServerError(response.value)
  }
}
