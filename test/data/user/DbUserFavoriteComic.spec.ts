import { FindCharacterByIdRepository } from "@/data/repository/character/FindCharacterByIdRepository"
import { UserFavoriteComicRepository } from "@/data/repository/user/UserFavoriteComicRepository"
import { DbUserFavoriteComic } from "@/data/usecase/user/DbUserFavoriteComic"
import { InvalidParamError, NotFoundError } from "@/domain/errors"
import { FavoriteComicData } from "@/domain/model/user/UserData"
import { RepositoryInternalError } from "@/data/error"
import { Either, failure, success } from "@/shared/Either"
import { FindComicByIdRepository } from "../repository/comic/FindComicByIdRepository"
import { ComicResponse } from "@/domain/model/comic/ComicData"


const userFavoriteRepoStubFactory = (): UserFavoriteComicRepository => {
  class UserFavoriteRepoStub implements UserFavoriteComicRepository {
    async favoriteComic(data: FavoriteComicData): Promise<Either<InvalidParamError, void>> {
      return success()
    }
  }
  return new UserFavoriteRepoStub()
}

const findComicByIdRepoStubFactory = (): FindComicByIdRepository => {
  class FindComicByIdRepoStub implements FindComicByIdRepository {
    async execute(id: string): Promise<Either<NotFoundError | RepositoryInternalError, ComicResponse>> {
      return success({
        id: 'id_Valid',
        title: 'Any title'
      } as ComicResponse)
    }


  }
  return new FindComicByIdRepoStub()
}

type TypeSut = {
  findComicByIdRepoStub: FindComicByIdRepository
  userFavoriteRepoStub: UserFavoriteComicRepository
  sut: DbUserFavoriteComic
}

const makeSutFactory = (): TypeSut => {
  const findComicByIdRepoStub = findComicByIdRepoStubFactory()
  const userFavoriteRepoStub = userFavoriteRepoStubFactory()

  const sut = new DbUserFavoriteComic(userFavoriteRepoStub, findComicByIdRepoStub)
  return { findComicByIdRepoStub, userFavoriteRepoStub, sut }
}

const fakeArgument = (): FavoriteComicData => ({
  comicId: 'comic_valid_id',
  userId: 'user_valid_id'
})


describe('DbUserFavoriteComic', () => {
  test('should return success when favorite comic', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute(fakeArgument())
    expect(response.isSuccess()).toBe(true)
  })

  test('should call find character by id with correct id', async () => {
    const { sut, findComicByIdRepoStub } = makeSutFactory()
    const executeSpy = jest.spyOn(findComicByIdRepoStub, 'execute')

    await sut.execute(fakeArgument())

    expect(executeSpy).toHaveBeenCalledWith('comic_valid_id')
  })


  test('should call favorite comic with params', async () => {
    const { sut, userFavoriteRepoStub } = makeSutFactory()
    const favoriteComicSpy = jest.spyOn(userFavoriteRepoStub, 'favoriteComic')

    await sut.execute(fakeArgument())

    expect(favoriteComicSpy).toHaveBeenCalledWith(fakeArgument())
  })


  test('should return failure when not found comic', async () => {
    const { sut, findComicByIdRepoStub } = makeSutFactory()

    jest.spyOn(findComicByIdRepoStub, 'execute').
      mockImplementationOnce(async () => failure(new Error('Any error')))

    const response = await sut.execute(fakeArgument())

    expect(response.isFailure()).toBe(true)
  })

  test('should return failure when not found comic', async () => {
    const { sut, userFavoriteRepoStub } = makeSutFactory()

    jest.spyOn(userFavoriteRepoStub, 'favoriteComic').
      mockImplementationOnce(async () => failure(new Error('Any error')))

    const response = await sut.execute(fakeArgument())

    expect(response.isFailure()).toBe(true)
  })


})