import { FindAllCharacterPageableRepository } from "@/data/repository/character/FindAllCharacterPageableRepository"
import { DbFindAllCharacterPageable } from "@/data/usecase/character/DbFindAllCharacterPageable"
import { CharacterResponse } from "@/domain/model/character/CharacterData"
import { Pagination } from "@/domain/helper/Pagination"
import { Either, success } from "@/shared/Either"
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

describe('FindAllCharacterPageable', () => {
  test('should return success when found register', async () => {
    class FindAllPageableRepoStub implements FindAllCharacterPageableRepository {
      async execute(page: number, limit: number): Promise<Either<NotFoundError, Pagination<CharacterResponse>>> {
        return success(defaultResponse)
      }
    }

    const repository = new FindAllPageableRepoStub()
    const sut = new DbFindAllCharacterPageable(repository)
    const response = await sut.execute(0, 20)
    expect(response.value).toEqual(defaultResponse)
  })
})