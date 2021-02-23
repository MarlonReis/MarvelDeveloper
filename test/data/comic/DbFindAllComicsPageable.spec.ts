import { NotFoundError } from "@/domain/errors"
import { Pagination } from "@/domain/helper/Pagination"
import { ComicResponse } from "@/domain/model/comic/ComicData"
import { Either, failure, success } from "@/shared/Either"
import {
  FindAllComicsPageableRepository
} from "@/data/repository/comic/FindAllComicsPageableRepository"
import {
  DbFindAllComicsPageable
} from "@/data/usecase/comic/DbFindAllComicsPageable"

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

const findAllPageableRepoStubFactory = (): FindAllComicsPageableRepository => {
  class FindAllComicsPageableRepoStub implements FindAllComicsPageableRepository {
    async execute(page: number, limit: number): Promise<Either<NotFoundError, Pagination<ComicResponse>>> {
      return success(defaultResponse)
    }
  }
  return new FindAllComicsPageableRepoStub()
}

type TypeSut = {
  findAllPageableRepoStub: FindAllComicsPageableRepository
  sut: DbFindAllComicsPageable
}

const makeSutFactory = (): TypeSut => {
  const findAllPageableRepoStub = findAllPageableRepoStubFactory()
  const sut = new DbFindAllComicsPageable(findAllPageableRepoStub)
  return { findAllPageableRepoStub, sut }
}

describe('DbFindAllComicsPageable', () => {
  test('should call repository with correct param', async () => {
    const { findAllPageableRepoStub, sut } = makeSutFactory()
    const executeSpy = jest.spyOn(findAllPageableRepoStub, 'execute')
    await sut.execute(5, 20)

    expect(executeSpy).toHaveBeenCalledWith(5, 20)
  })

  test('should return success when found register', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute(5, 20)
    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual(defaultResponse)
  })

  test('should return failure when repository return failure', async () => {
    const { findAllPageableRepoStub, sut } = makeSutFactory()
    
    jest.spyOn(findAllPageableRepoStub, 'execute').
      mockImplementationOnce(async () => failure(new Error('Any message')))

    const response = await sut.execute(5, 20)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new Error('Any message'))

  })

})