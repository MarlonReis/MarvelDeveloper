import { DbCreateCharacter } from "@/data/usecase/character/DbCreateCharacter"
import { CreateCharacterData } from "@/domain/model/character/CharacterData"
import { Either, success } from "@/shared/Either"
import { RepositoryInternalError } from "@/data/error"
import { CreateCharacterRepository } from "@/data/repository/character/CreateCharacterRepository"

describe('DbCreateCharacter', () => {
  test('should return success when repository return success', async () => {
    class CreateCharacterRepositoryStub implements CreateCharacterRepository {
      async execute(data: CreateCharacterData): Promise<Either<RepositoryInternalError, void>> {
        return success()
      }
    }
    const repository = new CreateCharacterRepositoryStub()
    const sut = new DbCreateCharacter(repository)
    const response = await sut.execute({
      name: 'Any Name',
      description: 'any description',
      topImage: 'path image to[',
      profileImage: 'path image profile',
    })

    expect(response.isSuccess()).toBe(true)
  })
})