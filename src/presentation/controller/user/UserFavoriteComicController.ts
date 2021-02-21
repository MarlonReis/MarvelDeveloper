import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { UserFavoriteComic } from '@/domain/usecase/user/UserFavoriteComic'
import { ok } from '@/presentation/helper'

export class UserFavoriteComicController implements Controller {
  private readonly userFavoriteComic: UserFavoriteComic

  constructor (userFavoriteComic: UserFavoriteComic) {
    this.userFavoriteComic = userFavoriteComic
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.authenticatedUserData
    const { comicId } = httpRequest.body

    this.userFavoriteComic.execute({ userId: id, comicId })
    return ok()
  }
}
