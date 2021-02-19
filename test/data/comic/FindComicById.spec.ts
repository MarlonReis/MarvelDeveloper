import { FindComicByIdRepository } from "@/data/repository/comic/FindComicByIdRepository"
import { DbFindComicById } from "@/data/usecase/comic/DbFindComicById"
import { NotFoundError, RepositoryInternalError } from "@/data/error"
import { ComicResponse } from "@/domain/model/comic/ComicData"
import { Either, success } from "@/shared/Either"

const defaultComicResponse:ComicResponse = {
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

describe('FindComicById', () => {
  test('should return success when found register by id', async () => {
    class FindComicByIdRepoStub implements FindComicByIdRepository {
      async execute(id: string): Promise<Either<NotFoundError | RepositoryInternalError, ComicResponse>> {
        return success(defaultComicResponse)
      }
    }
    const findComicByIdRepoStub = new FindComicByIdRepoStub()
    const sut = new DbFindComicById(findComicByIdRepoStub)
    const response = await sut.execute("valid-id")

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toHaveProperty('id', 'valid-id')
    expect(response.value).toHaveProperty('published', 'February 17, 2021')
    expect(response.value).toHaveProperty('coverImage', 'http://any-server.com/image.png')
    expect(response.value).toHaveProperty('characters')

  })
})