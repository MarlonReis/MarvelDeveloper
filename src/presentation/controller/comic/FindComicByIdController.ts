import { NotFoundError } from '@/domain/errors'
import { FindComicById } from '@/domain/usecase/comic/FindComicById'
import { IdEntity } from '@/domain/value-object'
import { badRequest, customError, internalServerError, ok } from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

const isInvalidParam = (req: HttpRequest): boolean => {
  if ('params' in req && 'id' in req.params) {
    return IdEntity.create(req.params.id).isFailure()
  }
  return true
}

export class FindComicByIdController implements Controller {
  private readonly findComicById: FindComicById

  constructor (findComicById: FindComicById) {
    this.findComicById = findComicById
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    if (isInvalidParam(request)) {
      return badRequest("Attribute 'id' is invalid!")
    }

    const response = await this.findComicById.execute(request.params.id)
    if (response.isSuccess()) {
      return ok(response.value)
    }

    if (response.value instanceof NotFoundError) {
      return customError(404, response.value)
    }

    return internalServerError(response.value)
  }
}
