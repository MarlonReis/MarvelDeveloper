import { FindAllComicsPageable } from '@/domain/usecase/comic/FindAllComicsPageable'
import { internalServerError, ok } from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class FindAllComicsPageableController implements Controller {
  private readonly findAllComicsPageable: FindAllComicsPageable

  constructor (findAllComicsPageable: FindAllComicsPageable) {
    this.findAllComicsPageable = findAllComicsPageable
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { page, perPage } = request.query ?? {}

    const response = await this.findAllComicsPageable.execute(page ?? 0, perPage ?? 10)

    if (response.isSuccess()) {
      return ok(response.value)
    }

    return internalServerError(response.value)
  }
}
