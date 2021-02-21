import { FindCharacterByIdRepository } from "@/data/repository/character/FindCharacterByIdRepository"
import { UserFavoriteComicRepository } from "@/data/repository/user/UserFavoriteComicRepository"
import { DbUserFavoriteComic } from "@/data/usecase/user/DbUserFavoriteComic"
import { CharacterResponse } from "@/domain/model/character/CharacterData"
import { InvalidParamError, NotFoundError } from "@/domain/errors"
import { FavoriteComicData } from "@/domain/model/user/UserData"
import { RepositoryInternalError } from "@/data/error"
import { Either, success } from "@/shared/Either"


const userFavoriteRepoStubFactory = (): UserFavoriteComicRepository => {
  class UserFavoriteRepoStub implements UserFavoriteComicRepository {
    async favoriteComic(data: FavoriteComicData): Promise<Either<InvalidParamError, void>> {
      return success()
    }
  }
  return new UserFavoriteRepoStub()
}

const findCharacterByIdRepoStubFactory = (): FindCharacterByIdRepository => {
  class FindCharacterByIdRepoStub implements FindCharacterByIdRepository {
    async execute(id: string): Promise<Either<NotFoundError | RepositoryInternalError, CharacterResponse>> {
      return success({ id: 'valid-id' } as CharacterResponse)
    }
  }
  return new FindCharacterByIdRepoStub()
}

type TypeSut = {
  findCharacterByIdRepoStub: FindCharacterByIdRepository
  userFavoriteRepoStub: UserFavoriteComicRepository
  sut: DbUserFavoriteComic
}

const makeSutFactory = (): TypeSut => {
  const findCharacterByIdRepoStub = findCharacterByIdRepoStubFactory()
  const userFavoriteRepoStub = userFavoriteRepoStubFactory()

  const sut = new DbUserFavoriteComic(userFavoriteRepoStub, findCharacterByIdRepoStub)
  return { findCharacterByIdRepoStub, userFavoriteRepoStub, sut }
}


describe('DbUserFavoriteComic', () => {
  test('should return success when favorite comic', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute({
      comicId: 'comic_valid_id',
      userId: 'user_valid_id'
    })
    expect(response.isSuccess()).toBe(true)
  })
})