import { NotFoundError } from "@/data/error"
import { ComicResponse } from "@/domain/model/comic/ComicData"
import { FindComicById } from "@/domain/usecase/comic/FindComicById"
import { Either, success } from "@/shared/Either"
import { FindComicByIdController } from "@/presentation/controller/comic/FindComicByIdController"

const defaultComicData = {
  title: "Any Title",
  published: "2020-10-10",
  writer: "Any Writer",
  penciler: "Any Penciler",
  coverArtist: "Any Cover Artist",
  description: "Any Description",
  edition: "5",
  coverImage: "http://server.com/images.png",
}

const findComicByIdStubFactory = (): FindComicById => {
  class FindComicByIdStub implements FindComicById {
    async execute(id: string): Promise<Either<NotFoundError, ComicResponse>> {
      return success(defaultComicData as any)
    }
  }
  return new FindComicByIdStub()
}

type TypeSut = {
  findComicByIdStub: FindComicById
  sut: FindComicByIdController
}

const makeSutFactory = (): TypeSut => {
  const findComicByIdStub = findComicByIdStubFactory()
  const sut = new FindComicByIdController(findComicByIdStub)
  return { findComicByIdStub, sut }
}

describe('FindComicByIdController', () => {
  test('should return statusCode 200 when found register by id', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({ params: { id: 'id-valid' } })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(defaultComicData)
  })
})