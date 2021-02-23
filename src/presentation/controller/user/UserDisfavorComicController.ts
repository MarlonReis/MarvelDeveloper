import { UserDisfavorComic } from '@/domain/usecase/user/UserDisfavorComic'
import { badRequest, internalServerError, ok } from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class UserDisfavorComicController implements Controller {
  private readonly userDisfavorComic: UserDisfavorComic

  constructor (userDisfavorComic: UserDisfavorComic) {
    this.userDisfavorComic = userDisfavorComic
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { id } = request.authenticatedUserData
    const { comicId } = request.body

    if (!comicId) {
      return badRequest("Attribute 'comicId' is invalid!")
    }

    const response = await this.userDisfavorComic.execute({
      comicId,
      userId: id
    })

    if (response.isSuccess()) {
      return ok()
    }

    return internalServerError(response.value)
  }
}
