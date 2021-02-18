import { InvalidParamError } from "@/domain/errors"
import { CreateComicData } from "@/domain/model/comic/ComicData"
import { Either, failure, success } from "@/shared/Either"
import { NotFoundError, RepositoryInternalError } from "@/data/error"
import {
  CreateComicRepository
} from "@/data/repository/comic/CreateComicRepository"
import { DbCreateComic } from "@/data/usecase/comic/DbCreateComic"
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

type TypeSut = {
  findCharacterByIdRepoStub: FindCharacterByIdRepository
  createRepoStub: CreateComicRepository
  sut: DbCreateComic
}

const makeSutFactory = (): TypeSut => {
  const findCharacterByIdRepoStub = findCharacterByIdRepoStubFactory()
  const createRepoStub = createComicRepoStubFactory()
  const sut = new DbCreateComic(createRepoStub, findCharacterByIdRepoStub)
  return { findCharacterByIdRepoStub, createRepoStub, sut }
}

describe('DbCreateComic', () => {
  test('should return success when create with success', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute(defaultComicParam)
    expect(response.isSuccess()).toBe(true)
  })

  test('should call find character by id with corrects params', async () => {
    const { sut, findCharacterByIdRepoStub } = makeSutFactory()
    const executeSpy = jest.spyOn(findCharacterByIdRepoStub, 'execute')

    const response = await sut.execute(defaultComicParam)
    expect(response.isSuccess()).toBe(true)

    expect(executeSpy).toBeCalledTimes(defaultComicParam.characters.length)

    expect(executeSpy).toBeCalledWith(defaultComicParam.characters[0].id)
    expect(executeSpy).toBeCalledWith(defaultComicParam.characters[1].id)
    expect(executeSpy).toBeCalledWith(defaultComicParam.characters[2].id)
  })

  test('should return failure when not found character by id', async () => {
    const { sut, findCharacterByIdRepoStub } = makeSutFactory()
    jest.spyOn(findCharacterByIdRepoStub, 'execute')
      .mockImplementationOnce(async () => failure(new NotFoundError('Any message')))

    const response = await sut.execute(defaultComicParam)
    expect(response.isFailure()).toBe(true)

    expect(response.value).toEqual(new NotFoundError('Any message'))
    expect(response.value).toMatchObject({
      message: 'Any message'
    })
  })

  test('should return success when not have characters', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute({
      ...defaultComicParam,
      characters: undefined
    })
    expect(response.isSuccess()).toBe(true)
  })

  test('should return success when characters array is empty', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute({
      ...defaultComicParam,
      characters: []
    })
    expect(response.isSuccess()).toBe(true)
  })


  test('should  return failure when repository throws', async () => {
    const { sut, createRepoStub } = makeSutFactory()
    jest.spyOn(createRepoStub, 'execute')
      .mockImplementationOnce(async () => failure(new Error('Any message')))

    const response = await sut.execute(defaultComicParam)
    expect(response.isFailure()).toBe(true)

    expect(response.value).toEqual(new Error('Any message'))
    expect(response.value).toMatchObject({
      message: 'Any message'
    })
  })


})