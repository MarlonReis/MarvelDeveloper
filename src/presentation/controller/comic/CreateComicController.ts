import { NotFoundError } from '@/domain/errors'
import { CreateComic } from '@/domain/usecase/comic/CreateComic'
import { ComicOrm } from '@/infrastructure/database/orm/model/ComicOrm'
import {
  createSuccess, customError,
  internalServerError, unProcessableEntity
} from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class CreateComicController implements Controller {
  private readonly createComic: CreateComic

  constructor (createComic: CreateComic) {
    this.createComic = createComic
  }

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const comicResponse = ComicOrm.create(req.body)

    if (comicResponse.isFailure()) {
      return unProcessableEntity(comicResponse.value)
    }

    const response = await this.createComic.execute(req.body)
    if (response.isSuccess()) {
      return createSuccess()
    }

    if (response.value instanceof NotFoundError) {
      return customError(404, response.value)
    }

    return internalServerError(response.value)
  }
}
