import { NotFoundError } from "@/data/error"
import { CharacterResponse } from "@/domain/model/character/CharacterData"
import { FindCharacterById } from "@/domain/usecase/character/FindCharacterById"
import { Either, success } from "@/shared/Either"
import { FindCharacterByIdController } from "@/presentation/controller/character/FindCharacterByIdController"

const defaultResponse = {
  id: 'string',
  name: 'string',
  description: 'string',
  topImage: 'string',
  profileImage: 'string',
  comics: []
}

describe('FindCharacterByIdController', () => {
  test('should return statusCode 200 when found character by id', async() => {

    class FindCharacterByIdStub implements FindCharacterById {
      async execute(id: string): Promise<Either<NotFoundError, CharacterResponse>> {
        return success(defaultResponse)
      }
    }
    const findCharacterByIdStub = new FindCharacterByIdStub()
    const sut = new FindCharacterByIdController(findCharacterByIdStub)
    const response = await sut.handle({ params: { id: 'valid-id' } })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(defaultResponse)

  })
})