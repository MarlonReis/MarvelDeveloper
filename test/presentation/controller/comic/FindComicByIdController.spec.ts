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


describe('FindComicByIdController', () => {
  test('should return statusCode 200 when found register by id', async () => {

    class FindComicByIdStub implements FindComicById {
      async execute(id: string): Promise<Either<NotFoundError, ComicResponse>> {
        return success(defaultComicData as any)
      }

    }
    const findComicByIdStub = new FindComicByIdStub()
    const sut = new FindComicByIdController(findComicByIdStub)
    const response = await sut.handle({ params: { id: 'id-valid' } })

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject(defaultComicData)

  })
})