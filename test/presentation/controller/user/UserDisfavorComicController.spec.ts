import { InvalidParamError } from "@/domain/errors"
import { FavoriteComicData } from "@/domain/model/user/UserData"
import { UserDisfavorComic } from "@/domain/usecase/user/UserDisfavorComic"
import { Either, failure, success } from "@/shared/Either"
import {
  UserDisfavorComicController
} from "@/presentation/controller/user/UserDisfavorComicController"
import { Role } from "@/domain/model/user/AuthenticationData"
import { badRequest, internalServerError, ok } from "@/presentation/helper"

const userDisfavorComicStubFactory = (): UserDisfavorComic => {
  class UserDisfavorComicStub implements UserDisfavorComic {
    async execute(data: FavoriteComicData): Promise<Either<InvalidParamError, void>> {
      return success()
    }
  }
  return new UserDisfavorComicStub()
}


const requestData = {
  body: {
    comicId: 'comic-id-valid'
  },
  authenticatedUserData: {
    id: 'user-valid-id',
    role: Role.USER
  }
}

type TypeSut = {
  userDisfavorComicStub: UserDisfavorComic
  sut: UserDisfavorComicController
}

const makeSutFactory = (): TypeSut => {
  const userDisfavorComicStub = userDisfavorComicStubFactory()
  const sut = new UserDisfavorComicController(userDisfavorComicStub)
  return { userDisfavorComicStub, sut }
}

describe('UserDisfavorComicController', () => {
  test('should call use case with correct params', async () => {
    const { userDisfavorComicStub, sut } = makeSutFactory()

    const executeSpy = jest.spyOn(userDisfavorComicStub, 'execute')
    await sut.handle(requestData)

    expect(executeSpy).toHaveBeenCalledWith({ comicId: 'comic-id-valid', userId: 'user-valid-id' })
  })

  test('should return badRequest when comicId is undefined', async () => {
    const { sut } = makeSutFactory()

    const response = await sut.handle({
      ...requestData, body: {}
    })

    expect(response).toEqual(badRequest("Attribute 'comicId' is invalid!"))
  })

  test('should return ok when use case return success', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle(requestData)
    expect(response).toEqual(ok())
  })

  test('should return internalServerError when return failure', async () => {
    const { userDisfavorComicStub, sut } = makeSutFactory()

    jest.spyOn(userDisfavorComicStub, 'execute').
      mockImplementationOnce(async () => failure(new Error('Any Error')))

    const response = await sut.handle(requestData)
    expect(response).toEqual(internalServerError(new Error('Any Error')))
  })




})