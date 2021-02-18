import { InvalidParamError } from "@/domain/errors"
import { CreateComicData } from "@/domain/model/comic/ComicData"
import { Either, success } from "@/shared/Either"
import { NotFoundError, RepositoryInternalError } from "@/data/error"
import {
  CreateComicRepository
} from "@/data/repository/comic/CreateComicRepository"
import { DbCreateComic } from "@/data/usecase/comic/DbCreateComic"
import { FindCharacterById } from "@/domain/usecase/character/FindCharacterById"
import { FindCharacterByIdRepository } from "../repository/character/FindCharacterByIdRepository"
import { CharacterResponse } from "@/domain/model/character/CharacterData"

const defaultComicParam = {
  title: 'Any title',
  published: 'February 17, 2021',
  writer: 'Any Writer, Other Writer',
  penciler: 'Valid Penciler',
  coverArtist: 'Any Cover Artist',
  description: 'Valid description',
  edition: '4',
  coverImage: 'http://any-server.com/image.png',
  characters: [{ id: 'valid-id-one' }, { id: 'valid-id-two' }, { id: 'valid-id-three' }]
}

const createComicRepoStubFactory = (): CreateComicRepository => {
  class CreateComicRepositoryStub implements CreateComicRepository {
    async execute(data: CreateComicData): Promise<Either<InvalidParamError | RepositoryInternalError, void>> {
      return success()
    }
  }
  return new CreateComicRepositoryStub()
}

const findCharacterByIdRepoStubFactory = (): FindCharacterByIdRepository => {
  class FindCharacterByIdRepoStub implements FindCharacterByIdRepository {
    async execute(id: string): Promise<Either<NotFoundError | RepositoryInternalError, CharacterResponse>> {
      return success({
        id: 'valid-id',
        name: 'Any Name',
        description: 'Any Description',
        topImage: 'http://any-host.com/img.png',
        profileImage: 'http://any-host.com/img.png',
        comics: []
      })
    }
  }

  return new FindCharacterByIdRepoStub()
}

describe('DbCreateComic', () => {
  test('should return success when create with success', async () => {
    const findCharacterByIdRepoStub = findCharacterByIdRepoStubFactory()
    const createRepoStub = createComicRepoStubFactory()
    const sut = new DbCreateComic(createRepoStub, findCharacterByIdRepoStub)
    const response = await sut.execute(defaultComicParam)
    expect(response.isSuccess()).toBe(true)
  })
})