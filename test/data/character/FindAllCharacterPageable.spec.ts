import { FindAllCharacterPageableRepository } from "@/data/repository/character/FindAllCharacterPageableRepository"
import { DbFindAllCharacterPageable } from "@/data/usecase/character/DbFindAllCharacterPageable"
import { CharacterResponse } from "@/domain/model/character/CharacterData"
import { Pagination } from "@/domain/helper/Pagination"
import { Either, failure, success } from "@/shared/Either"
import { NotFoundError } from "@/data/error"


const defaultResponse = {
  from: 0,
  to: 10,
  perPage: 20,
  total: 200,
  currentPage: 0,
  prevPage: false,
  nextPage: true,
  data: [{
    id: 'valid-id',
    name: 'Valid Name',
    description: 'Any Description',
    topImage: 'any path top image',
    profileImage: 'any path profile image',
    comics: [],
  }]
}

const findAllPageableRepoStubFactory = (): FindAllCharacterPageableRepository => {
  class FindAllPageableRepoStub implements FindAllCharacterPageableRepository {
    async execute(page: number, limit: number): Promise<Either<NotFoundError, Pagination<CharacterResponse>>> {
      return success(defaultResponse)
    }
  }
  return new FindAllPageableRepoStub()
}

type TypeSut = {
  repository: FindAllCharacterPageableRepository
  sut: DbFindAllCharacterPageable
}

const makeSutFactory = (): TypeSut => {
  const repository = findAllPageableRepoStubFactory()
  const sut = new DbFindAllCharacterPageable(repository)
  return { repository, sut }
}

describe('FindAllCharacterPageable', () => {
  test('should return success when found register', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.execute(0, 20)

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual(defaultResponse)
  })

  test('should return failure with NotFoundError when not found register', async () => {
    const { sut, repository } = makeSutFactory()
    jest.spyOn(repository, 'execute').mockImplementationOnce(
      async () => failure(new NotFoundError('Any message'))
    )

    const response = await sut.execute(0, 20)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new NotFoundError('Any message'))
  })
})