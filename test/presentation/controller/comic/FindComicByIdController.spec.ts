import { NotFoundError } from '@/domain/errors'
import { ComicResponse } from "@/domain/model/comic/ComicData"
import { FindComicById } from "@/domain/usecase/comic/FindComicById"
import { Either, failure, success } from "@/shared/Either"
import { FindComicByIdController } from "@/presentation/controller/comic/FindComicByIdController"
import { BadRequestError } from "@/presentation/error"

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

  test('should return statusCode 400 when para is undefined', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({})

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new BadRequestError("Attribute 'id' is invalid!"))
  })

  test('should call use case with correct param', async () => {
    const { sut, findComicByIdStub } = makeSutFactory()

    const executeSpy = jest.spyOn(findComicByIdStub, 'execute')

    await sut.handle({ params: { id: 'valid-id' } })

    expect(executeSpy).toBeCalledWith("valid-id")
  })

  test('should statusCode 404 when not found', async () => {
    const { sut, findComicByIdStub } = makeSutFactory()

    jest.spyOn(findComicByIdStub, 'execute').
      mockImplementationOnce(async () => failure(new NotFoundError("Error message")))

    const response = await sut.handle({ params: { id: 'valid-id' } })

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual(new NotFoundError("Error message"))
  })


  test('should statusCode 500 when use case return other error', async () => {
    const { sut, findComicByIdStub } = makeSutFactory()

    jest.spyOn(findComicByIdStub, 'execute').
      mockImplementationOnce(async () => failure(new Error("Error message")))

    const response = await sut.handle({ params: { id: 'valid-id' } })

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new Error("Internal server error"))
  })


})