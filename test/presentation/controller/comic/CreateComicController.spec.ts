import { InvalidParamError } from "@/domain/errors"
import { CreateComicData } from "@/domain/model/comic/ComicData"
import { CreateComic } from "@/domain/usecase/comic/CreateComic"
import { Either, failure, success } from "@/shared/Either"
import {
  CreateComicController
} from "@/presentation/controller/comic/CreateComicController"
import { NotFoundError } from '@/domain/errors'

const defaultComicData = {
  title: "Any Title",
  published: "2021-03-01",
  writer: "Any Writer",
  penciler: "Any Penciler",
  coverArtist: "coverArtist",
  description: "any description",
  edition: "4",
  coverImage: "http://anyurl.com/image.png",
  characters: [{ id: 'valid-id' }]
}

const createComicFactory = (): CreateComic => {
  class CreateComicStub implements CreateComic {
    async execute(data: CreateComicData): Promise<Either<InvalidParamError, void>> {
      return success()
    }
  }
  return new CreateComicStub()
}
type TypeSut = {
  createComicStub: CreateComic
  sut: CreateComicController
}
const makeSutFactory = (): TypeSut => {
  const createComicStub = createComicFactory()
  const sut = new CreateComicController(createComicStub)
  return { createComicStub, sut }
}

describe('CreateComicController', () => {
  test('should return statusCode 201 when use case return success', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({ body: defaultComicData })
    expect(response.statusCode).toBe(201)
  })

  test('should call use case with correct param', async () => {
    const { sut, createComicStub } = makeSutFactory()
    const executeSpy = jest.spyOn(createComicStub, 'execute')
    await sut.handle({ body: defaultComicData })

    expect(executeSpy).toBeCalledWith(defaultComicData)
  })

  test('should return statusCode 422 when param is invalid', async () => {
    const { sut } = makeSutFactory()

    const response = await sut.handle({
      body: { ...defaultComicData, published: '20/20/20' }
    })

    expect(response.statusCode).toBe(422)
    expect(response.body).toMatchObject({
      message: "Attribute 'published' equals '20/20/20' is invalid!",
    })
  })


  test('should return statusCode 404 when not found character', async () => {
    const { sut, createComicStub } = makeSutFactory()

    jest.spyOn(createComicStub, 'execute').
      mockImplementationOnce(
        async () => failure(new NotFoundError("Error message"))
      )

    const response = await sut.handle({ body: defaultComicData })

    expect(response.statusCode).toBe(404)
    expect(response.body).toMatchObject({
      message: "Error message",
    })
  })

  test('should return statusCode 500 when use case throw error', async () => {
    const { sut, createComicStub } = makeSutFactory()

    jest.spyOn(createComicStub, 'execute').
      mockImplementationOnce(
        async () => failure(new Error("Error message"))
      )

    const response = await sut.handle({ body: defaultComicData })

    expect(response.statusCode).toBe(500)
    expect(response.body).toMatchObject({
      cause: new Error("Error message"),
      message: 'Internal server error',
    })
  })

})