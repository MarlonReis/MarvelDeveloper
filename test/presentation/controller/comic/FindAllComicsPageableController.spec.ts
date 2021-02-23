import { NotFoundError } from "@/domain/errors"
import { Pagination } from "@/domain/helper/Pagination"
import { ComicResponse } from "@/domain/model/comic/ComicData"
import { FindAllComicsPageable } from "@/domain/usecase/comic/FindAllComicsPageable"
import { Either, failure, success } from "@/shared/Either"
import { FindAllComicsPageableController } from "@/presentation/controller/comic/FindAllComicsPageableController"
import { internalServerError, ok } from "@/presentation/helper"

const defaultComicData: ComicResponse = {
  id: 'valid-id',
  title: "Any Title",
  published: "2020-10-10",
  writer: "Any Writer",
  penciler: "Any Penciler",
  coverArtist: "Any Cover Artist",
  description: "Any Description",
  edition: "5",
  coverImage: "http://server.com/images.png",
  characters: []
}

const defaultPageableResponse = {
  from: 1,
  to: 1,
  perPage: 1,
  total: 1,
  currentPage: 1,
  prevPage: false,
  nextPage: false,
  data: [defaultComicData]
}

const findAllPageableStubFactory = (): FindAllComicsPageable => {
  class FindAllComicsPageableStub implements FindAllComicsPageable {
    async execute(page: number, limit: number): Promise<Either<NotFoundError, Pagination<ComicResponse>>> {
      return success(defaultPageableResponse)
    }
  }
  return new FindAllComicsPageableStub()
}

type TypeSut = {
  findAllComicsPageableStub: FindAllComicsPageable
  sut: FindAllComicsPageableController
}

const makeSutFactory = (): TypeSut => {
  const findAllComicsPageableStub = findAllPageableStubFactory()
  const sut = new FindAllComicsPageableController(findAllComicsPageableStub)
  return { findAllComicsPageableStub, sut }
}

describe('FindAllComicsPageableController', () => {
  test('should call use case with correct params', async () => {
    const { sut, findAllComicsPageableStub } = makeSutFactory()
    const executeSpy = jest.spyOn(findAllComicsPageableStub, 'execute')

    await sut.handle({ query: { page: 1, perPage: 10 } })

    expect(executeSpy).toHaveBeenCalledWith(1, 10)
  })

  test('should call with default value when receive undefined', async () => {
    const { sut, findAllComicsPageableStub } = makeSutFactory()
    const executeSpy = jest.spyOn(findAllComicsPageableStub, 'execute')

    await sut.handle({})

    expect(executeSpy).toHaveBeenCalledWith(0, 10)
  })

  test("should return comics pageable and statusCode 200", async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({ query: { page: 1, perPage: 10 } })
    expect(response).toMatchObject(ok(defaultPageableResponse))
  })


  test('should return internalServerError when use case return failure', async () => {
    const { sut, findAllComicsPageableStub } = makeSutFactory()

    jest.spyOn(findAllComicsPageableStub, 'execute').
      mockImplementationOnce(async () => failure(new Error("Error message")))

    const response = await sut.handle({ query: { page: 1, perPage: 10 } })

    expect(response).toEqual(internalServerError(new Error("Error message")))
  })

})