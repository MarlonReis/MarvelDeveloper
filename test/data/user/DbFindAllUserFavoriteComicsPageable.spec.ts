import { Pagination } from "@/domain/helper/Pagination"
import { ComicResponse } from "@/domain/model/comic/ComicData"
import { Either, failure, success } from "@/shared/Either"
import { RepositoryInternalError } from "@/data/error"
import {
  FindAllUserFavoriteComicsPageable
} from "@/domain/usecase/user/FindAllUserFavoriteComicsPageable"
import {
  DbFindAllUserFavoriteComicsPageable
} from "@/data/usecase/user/DbFindAllUserFavoriteComicsPageable"
import { FindAllUserFavoriteComicsPageableRepository } from "../repository/user/FindAllUserFavoriteComicsPageableRepository"

const defaultResponse = {
  from: 0,
  to: 10,
  perPage: 20,
  total: 200,
  currentPage: 0,
  prevPage: false,
  nextPage: true,
  data: [{
    id: 'valid-id',
    title: 'Any title',
    published: 'February 17, 2021',
    writer: 'Any Writer, Other Writer',
    penciler: 'Valid Penciler',
    coverArtist: 'Any Cover Artist',
    description: 'Valid description',
    edition: '4',
    coverImage: 'http://any-server.com/image.png',
    characters: [
      {
        id: 'valid-id',
        name: 'Any Name',
        description: 'Any Description',
        topImage: 'http://any-host.com/img.png',
        profileImage: 'http://any-host.com/img.png'
      }
    ]
  }]
}

const findAllRepoStubFactory = (): FindAllUserFavoriteComicsPageableRepository => {
  class FindAllUserFavoriteComicsPageableRepoStub implements FindAllUserFavoriteComicsPageableRepository {
    async execute(userId: string, page: number, limit: number): Promise<Either<RepositoryInternalError, Pagination<ComicResponse>>> {
      return success(defaultResponse);
    }
  }
  return new FindAllUserFavoriteComicsPageableRepoStub()
}

type TypeSut = {
  findAllPageableStub: FindAllUserFavoriteComicsPageableRepository
  sut: DbFindAllUserFavoriteComicsPageable
}

const makeSutFactory = (): TypeSut => {
  const findAllPageableStub = findAllRepoStubFactory()
  const sut = new DbFindAllUserFavoriteComicsPageable(findAllPageableStub)
  return { findAllPageableStub, sut }
}

describe('DbFindAllUserFavoriteComicsPageable', () => {
  test('should call repository with correct params', async () => {
    const { sut, findAllPageableStub } = makeSutFactory()
    const executeSpy = jest.spyOn(findAllPageableStub, 'execute')

    await sut.execute('valid-id', 1, 10)

    expect(executeSpy).toHaveBeenCalledWith('valid-id', 1, 10)
  })

  test('should return success when found register', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute("valid-did", 1, 10)

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual(defaultResponse)
  })

  test('should return failure when repository return error', async () => {
    const { sut, findAllPageableStub } = makeSutFactory()
    jest.spyOn(findAllPageableStub, 'execute').
      mockImplementationOnce(async () => failure(new RepositoryInternalError(new Error('Any error'))))
    const response = await sut.execute("valid-did", 1, 10)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new RepositoryInternalError(new Error('Any error')))
  })

})