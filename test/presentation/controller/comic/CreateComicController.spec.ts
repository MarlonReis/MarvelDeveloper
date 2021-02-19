import { InvalidParamError } from "@/domain/errors"
import { CreateComicData } from "@/domain/model/comic/ComicData"
import { CreateComic } from "@/domain/usecase/comic/CreateComic"
import { Either, success } from "@/shared/Either"
import {
  CreateComicController
} from "@/presentation/controller/comic/CreateComicController"

describe('CreateComicController', () => {
  test('should return statusCode 200 when use case return success', async () => {
    class CreateComicStub implements CreateComic {
      async execute(data: CreateComicData): Promise<Either<InvalidParamError, void>> {
        return success()
      }
    }

    const createComicStub = new CreateComicStub()
    const sut = new CreateComicController(createComicStub)
    const response = await sut.handle({
      body: {
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
    })
    expect(response.statusCode).toBe(201)
  })
})