import { DbUserDisfavorComic } from "@/data/usecase/user/DbUserDisfavorComic"
import { UserDisfavorComicRepository } from "@/data/repository/comic/UserDisfavorComicRepository"
import { InvalidParamError } from "@/domain/errors"
import { FavoriteComicData } from "@/domain/model/user/UserData"
import { Either, failure, success } from "@/shared/Either"
import { RepositoryInternalError } from "@/data/error"

const defaultParam = (): FavoriteComicData => ({ comicId: 'valid-comic-id', userId: 'valid-user-id' })

const userDisfavorComicRepoStubFactory = (): UserDisfavorComicRepository => {
  class UserDisfavorComicRepoStub implements UserDisfavorComicRepository {
    async execute(data: FavoriteComicData): Promise<Either<InvalidParamError | RepositoryInternalError, void>> {
      return success()
    }
  }
  return new UserDisfavorComicRepoStub()
}

type TypeSut = {
  userDisfavorComicRepoStub: UserDisfavorComicRepository
  sut: DbUserDisfavorComic
}

const makeSutFactory = (): TypeSut => {
  const userDisfavorComicRepoStub = userDisfavorComicRepoStubFactory()
  const sut = new DbUserDisfavorComic(userDisfavorComicRepoStub)
  return { userDisfavorComicRepoStub, sut }
}

describe('DbUserDisfavorComic', () => {
  test('should call repository with correct param', async () => {
    const { sut, userDisfavorComicRepoStub } = makeSutFactory()

    const executeSpy = jest.spyOn(userDisfavorComicRepoStub, 'execute')
    await sut.execute(defaultParam())

    expect(executeSpy).toHaveBeenCalledWith(defaultParam())
  })

  test('should return success when repository return success', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute(defaultParam())

    expect(response.isSuccess()).toBe(true)
  })

  test('should return failure when repository return failure', async () => {
    const { sut, userDisfavorComicRepoStub } = makeSutFactory()

    jest.spyOn(userDisfavorComicRepoStub, 'execute')
    .mockImplementationOnce(async () => failure(new Error('Any error')))

    const response = await sut.execute(defaultParam())
    
    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new Error('Any error'))
  })

})