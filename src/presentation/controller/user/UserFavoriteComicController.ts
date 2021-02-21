import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { UserFavoriteComic } from '@/domain/usecase/user/UserFavoriteComic'
import { badRequest, customError, internalServerError, ok } from '@/presentation/helper'
import { NotFoundError } from '@/domain/errors'

export class UserFavoriteComicController implements Controller {
  private readonly userFavoriteComic: UserFavoriteComic

  constructor (userFavoriteComic: UserFavoriteComic) {
    this.userFavoriteComic = userFavoriteComic
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.authenticatedUserData
    const { comicId } = httpRequest.body

    if (!comicId) {
      return badRequest("Attribute 'comicId' is invalid!")
    }

    const response = await this.userFavoriteComic.execute({
      userId: id,
      comicId
    })

    if (response.isSuccess()) {
      return ok()
    }

    if (response.value instanceof NotFoundError) {
      return customError(404, response.value)
    }

    return internalServerError(response.value)
  }
}
