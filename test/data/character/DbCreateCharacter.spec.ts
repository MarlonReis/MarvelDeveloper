import { DbCreateCharacter } from "@/data/usecase/character/DbCreateCharacter"
import { CreateCharacterData } from "@/domain/model/character/CharacterData"
import { Either, failure, success } from "@/shared/Either"
import { RepositoryInternalError } from "@/data/error"
import { CreateCharacterRepository } from "@/data/repository/character/CreateCharacterRepository"
import { InvalidParamError } from "@/domain/errors"


const createCharacterRepoStubFactory = (): CreateCharacterRepository => {
  class CreateCharacterRepositoryStub implements CreateCharacterRepository {
    async execute(data: CreateCharacterData): Promise<Either<RepositoryInternalError, void>> {
      return success()
    }
  }
  return new CreateCharacterRepositoryStub()
}

type TypeSut = {
  repository: CreateCharacterRepository
  sut: DbCreateCharacter
}

const makeFactory = (): TypeSut => {
  const repository = createCharacterRepoStubFactory()
  const sut = new DbCreateCharacter(repository)
  return { repository, sut }
}

const defaultParam = {
  name: 'Any Name',
  description: 'any description',
  topImage: 'path image to[',
  profileImage: 'path image profile',
}

describe('DbCreateCharacter', () => {
  test('should return success when repository return success', async () => {
    const { sut } = makeFactory()
    const response = await sut.execute(defaultParam)
    expect(response.isSuccess()).toBe(true)
  })

  test('should return failure when repository return failure', async () => {
    const error = new RepositoryInternalError(new Error('Any error'))
    const { sut, repository } = makeFactory()

    jest.spyOn(repository, 'execute').mockImplementationOnce(() => Promise.resolve(failure(error)))

    const response = await sut.execute(defaultParam)
    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(error)
  })

})