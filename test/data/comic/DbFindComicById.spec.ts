import { FindComicByIdRepository } from "@/data/repository/comic/FindComicByIdRepository"
import { DbFindComicById } from "@/data/usecase/comic/DbFindComicById"
import { NotFoundError, RepositoryInternalError } from "@/data/error"
import { ComicResponse } from "@/domain/model/comic/ComicData"
import { Either, failure, success } from "@/shared/Either"

const defaultComicResponse: ComicResponse = {
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
}

const findComicByIdRepoStubFactory = (): FindComicByIdRepository => {
  class FindComicByIdRepoStub implements FindComicByIdRepository {
    async execute(id: string): Promise<Either<NotFoundError | RepositoryInternalError, ComicResponse>> {
      return success(defaultComicResponse)
    }
  }
  return new FindComicByIdRepoStub()
}

type TypeSut = {
  findComicByIdRepoStub: FindComicByIdRepository
  sut: DbFindComicById
}

const makeSutFactory = (): TypeSut => {
  const findComicByIdRepoStub = findComicByIdRepoStubFactory()
  const sut = new DbFindComicById(findComicByIdRepoStub)
  return { findComicByIdRepoStub, sut }
}

describe('FindComicById', () => {
  test('should return success when found register by id', async () => {
    const { sut } = makeSutFactory()

    const response = await sut.execute("valid-id")

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toHaveProperty('id', 'valid-id')
    expect(response.value).toHaveProperty('published', 'February 17, 2021')
    expect(response.value).toHaveProperty('coverImage', 'http://any-server.com/image.png')
    expect(response.value).toHaveProperty('characters', expect.any(Array))
  })

  test('should call use case whe correct id', async () => {
    const { sut, findComicByIdRepoStub } = makeSutFactory()
    const executeSpy = jest.spyOn(findComicByIdRepoStub, 'execute')

    await sut.execute("valid-id")

    expect(executeSpy).toBeCalledWith('valid-id')
  })

  test('should return failure when repository return failure', async () => {
    const { sut, findComicByIdRepoStub } = makeSutFactory()

    jest.spyOn(findComicByIdRepoStub, 'execute')
      .mockImplementationOnce(async () => failure(new NotFoundError('Any message')))

    const response = await sut.execute("valid-id")

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new NotFoundError('Any message'))
  })

})