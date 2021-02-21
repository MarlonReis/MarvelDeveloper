import { NotFoundError } from '@/domain/errors'
import { CharacterResponse } from "@/domain/model/character/CharacterData"
import { FindCharacterById } from "@/domain/usecase/character/FindCharacterById"
import { Either, failure, success } from "@/shared/Either"
import { FindCharacterByIdController } from "@/presentation/controller/character/FindCharacterByIdController"

const defaultResponse = {
  id: 'string',
  name: 'string',
  description: 'string',
  topImage: 'string',
  profileImage: 'string',
  comics: []
}

const findCharacterByIdStubFactory = (): FindCharacterById => {
  class FindCharacterByIdStub implements FindCharacterById {
    async execute(id: string): Promise<Either<NotFoundError, CharacterResponse>> {
      return success(defaultResponse)
    }
  }
  return new FindCharacterByIdStub()
}

type TypeSut = {
  findCharacterByIdStub: FindCharacterById
  sut: FindCharacterByIdController
}
const makeSutFactory = (): TypeSut => {
  const findCharacterByIdStub = findCharacterByIdStubFactory()
  const sut = new FindCharacterByIdController(findCharacterByIdStub)
  return { findCharacterByIdStub, sut }
}

describe('FindCharacterByIdController', () => {
  test('should return statusCode 200 when found character by id', async () => {
    const { sut } = makeSutFactory()

    const response = await sut.handle({ params: { id: 'valid-id' } })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(defaultResponse)
  })

  test('should return statusCode 400 when id is undefined', async () => {
    const { sut } = makeSutFactory()

    const response = await sut.handle({})

    expect(response.statusCode).toEqual(400)
    expect(response.body).toMatchObject({
      message: "Attribute 'id' is invalid!"
    })
  })

  test('should return statusCode 500 when use case return error', async () => {
    const { sut, findCharacterByIdStub } = makeSutFactory()

    jest.spyOn(findCharacterByIdStub, 'execute').
      mockImplementationOnce(async () => failure(new Error('Any error')))

    const response = await sut.handle({ params: { id: 'valid-id' } })

    expect(response.statusCode).toEqual(500)
    expect(response.body).toMatchObject({
      cause: new Error('Any error'),
      message: 'Internal server error'
    })
  })

})