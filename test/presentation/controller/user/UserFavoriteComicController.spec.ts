import { InvalidParamError, NotFoundError } from "@/domain/errors"
import { Role } from "@/domain/model/user/AuthenticationData"
import { FavoriteComicData } from "@/domain/model/user/UserData"
import { UserFavoriteComic } from "@/domain/usecase/user/UserFavoriteComic"
import { Either, failure, success } from "@/shared/Either"
import {
  UserFavoriteComicController
} from "@/presentation/controller/user/UserFavoriteComicController"
import { HttpRequest } from "@/presentation/protocols"
import { badRequest, customError, internalServerError, ok } from "@/presentation/helper"

const userFavoriteComicStubFactory = (): UserFavoriteComic => {
  class UserFavoriteComicStub implements UserFavoriteComic {
    async execute(data: FavoriteComicData): Promise<Either<InvalidParamError, void>> {
      return success()
    }
  }
  return new UserFavoriteComicStub()
}

type TypeSut = {
  userFavoriteComicStub: UserFavoriteComic
  sut: UserFavoriteComicController
}

const makeSutFactory = (): TypeSut => {
  const userFavoriteComicStub = userFavoriteComicStubFactory()
  const sut = new UserFavoriteComicController(userFavoriteComicStub)
  return { sut, userFavoriteComicStub }
}

const requestParam = (): HttpRequest => ({
  authenticatedUserData: {
    id: 'user-valid-id',
    role: Role.USER
  },
  body: {
    comicId: 'comic-id-valid'
  }
})


describe('UserFavoriteComicController', () => {
  test('should call user favorite comic with correct param', async () => {
    const { sut, userFavoriteComicStub } = makeSutFactory()

    const executeSpy = jest.spyOn(userFavoriteComicStub, 'execute')

    await sut.handle(requestParam())

    expect(executeSpy).toHaveBeenCalledWith({
      comicId: 'comic-id-valid',
      userId: 'user-valid-id'
    })
  })

  test('should return statusCode 200 when return success', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle(requestParam())

    expect(response.statusCode).toEqual(200)
    expect(response).toEqual(ok())
  })


  test('should return statusCode 404 when use case return not found', async () => {
    const { sut, userFavoriteComicStub } = makeSutFactory()

    jest.spyOn(userFavoriteComicStub, 'execute').
      mockImplementationOnce(async () => failure(new NotFoundError("Any message")))

    const response = await sut.handle(requestParam())

    expect(response.statusCode).toEqual(404)
    expect(response).toEqual(customError(404, new NotFoundError("Any message")))
  })

  test('should return statusCode 500 when use case return error', async () => {
    const { sut, userFavoriteComicStub } = makeSutFactory()

    jest.spyOn(userFavoriteComicStub, 'execute').
      mockImplementationOnce(async () => failure(new Error("Any message")))

    const response = await sut.handle(requestParam())

    expect(response.statusCode).toEqual(500)
    expect(response).toEqual(internalServerError(new Error("Any message")))
  })

  test('should return statusCode 400 when not have comicid', async () => {
    const { sut, userFavoriteComicStub } = makeSutFactory()

    const response = await sut.handle({
      authenticatedUserData: {
        id: 'user-valid-id',
        role: Role.USER
      },
      body: {
        
      }
    })

    expect(response.statusCode).toEqual(400)
    expect(response).toEqual(badRequest("Attribute 'comicId' is invalid!"))
  })


})