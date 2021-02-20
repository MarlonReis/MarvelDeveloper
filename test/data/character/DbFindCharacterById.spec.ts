import {
  FindCharacterByIdRepository
} from "@/data/repository/character/FindCharacterByIdRepository";
import { DbFindCharacterById } from "@/data/usecase/character/DbFindCharacterById";
import { CharacterResponse } from "@/domain/model/character/CharacterData";
import { NotFoundError, RepositoryInternalError } from "@/data/error";
import { Either, failure, success } from "@/shared/Either";

const defaultCharacterData = {
  id: 'valid-id',
  name: 'Any Name',
  description: 'Any description',
  topImage: 'path top image',
  profileImage: 'path profile image',
  comics: []
}

const findCharacterByIdRepoStubFactory = (): FindCharacterByIdRepository => {
  class FindCharacterByIdRepositoryStub implements FindCharacterByIdRepository {
    async execute(id: string): Promise<Either<NotFoundError | RepositoryInternalError, CharacterResponse>> {
      return success(defaultCharacterData)
    }
  }
  return new FindCharacterByIdRepositoryStub()
}

type TypeSut = {
  findByIdRepoStub: FindCharacterByIdRepository
  sut: DbFindCharacterById
}

const makeSutFactory = (): TypeSut => {
  const findByIdRepoStub = findCharacterByIdRepoStubFactory()
  const sut = new DbFindCharacterById(findByIdRepoStub);
  return { findByIdRepoStub, sut }
}

describe('DbFindCharacterById', () => {

  test('should return success when found by id', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute('valid-id')
    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual(defaultCharacterData)
  })

  test('should return failure when not found by id', async () => {
    const { sut, findByIdRepoStub } = makeSutFactory()
    
    jest.spyOn(findByIdRepoStub, 'execute').
      mockImplementationOnce(() => Promise.resolve(failure(new NotFoundError('any message'))))
    
    const response = await sut.execute('valid-id')
    
    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new NotFoundError('any message'))
  })
})