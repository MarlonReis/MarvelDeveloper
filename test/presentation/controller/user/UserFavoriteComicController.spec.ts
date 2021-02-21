import { InvalidParamError } from "@/domain/errors"
import { Role } from "@/domain/model/user/AuthenticationData"
import { FavoriteComicData } from "@/domain/model/user/UserData"
import { UserFavoriteComic } from "@/domain/usecase/user/UserFavoriteComic"
import { Either, success } from "@/shared/Either"
import {
  UserFavoriteComicController
} from "@/presentation/controller/user/UserFavoriteComicController"
import { HttpRequest } from "@/presentation/protocols"

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


})