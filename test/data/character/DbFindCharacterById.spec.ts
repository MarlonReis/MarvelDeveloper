import {
  FindCharacterByIdRepository
} from "@/data/repository/character/FindCharacterByIdRepository";
import { DbFindCharacterById } from "@/data/usecase/character/DbFindCharacterById";
import { CharacterResponse } from "@/domain/model/character/CharacterData";
import { NotFoundError, RepositoryInternalError } from "@/data/error";
import { Either, success } from "@/shared/Either";

const defaultCharacterData = {
  id: 'valid-id',
  name: 'Any Name',
  description: 'Any description',
  topImage: 'path top image',
  profileImage: 'path profile image',
  comics: []
}

describe('DbFindCharacterById', () => {

  test('should return success when found by id', async () => {
    class FindCharacterByIdRepositoryStub implements FindCharacterByIdRepository {
      async execute(id: string): Promise<Either<NotFoundError | RepositoryInternalError, CharacterResponse>> {
        return success(defaultCharacterData)
      }
    }
    const findByIdRepoStub = new FindCharacterByIdRepositoryStub()
    const sut = new DbFindCharacterById(findByIdRepoStub);
    const response = await sut.execute('valid-id')
    expect(response.value).toEqual(defaultCharacterData)
  })

})