import {
  FindAllUserFavoriteComicsPageable
} from '@/domain/usecase/user/FindAllUserFavoriteComicsPageable'
import { MissingParamError } from '@/presentation/error'
import { internalServerError, ok, unProcessableEntity } from '@/presentation/helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class FindAllUserFavoriteComicsPageableController implements Controller {
  private readonly findAllUserFavoritePageable: FindAllUserFavoriteComicsPageable

  constructor (findAllUserFavoritePageable: FindAllUserFavoriteComicsPageable) {
    this.findAllUserFavoritePageable = findAllUserFavoritePageable
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { id } = request.authenticatedUserData ?? {}
    const { page, perPage } = request.query ?? {}

    if (!id) {
      return unProcessableEntity(new MissingParamError('id'))
    }

    const response = await this.findAllUserFavoritePageable.execute(id, page, perPage)

    if (response.isSuccess()) {
      return ok(response.value)
    }

    return internalServerError(response.value)
  }
}
