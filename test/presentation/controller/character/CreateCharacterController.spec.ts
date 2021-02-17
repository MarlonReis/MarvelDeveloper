import { InvalidParamError } from "@/domain/errors";
import { Either, failure, success } from "@/shared/Either";

import { CreateCharacterData } from "@/domain/model/character/CharacterData";
import { CreateCharacter } from "@/domain/usecase/character/CreateCharacter";
import { CreateCharacterController } from "@/presentation/controller/character/CreateCharacterController";

const defaultCharacterData = {
  name: 'Any Name',
  description: 'Any description',
  topImage: 'https://anyserver.com/top-image.png',
  profileImage: 'https://anyserver.com/profileImage.png',
}

const createCharacterStubFactory = (): CreateCharacter => {
  class CreateCharacterStub implements CreateCharacter {
    async execute(data: CreateCharacterData): Promise<Either<InvalidParamError, void>> {
      return success()
    }
  }
  return new CreateCharacterStub()
}

type TypeSut = {
  createCharacterStub: CreateCharacter
  sut: CreateCharacterController
}

const makeSutFactory = (): TypeSut => {
  const createCharacterStub = createCharacterStubFactory()
  const sut = new CreateCharacterController(createCharacterStub);
  return { createCharacterStub, sut }
}

describe('CreateCharacterController', () => {

  test('should create a new character with success', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({ body: defaultCharacterData })
    expect(response).toEqual({ statusCode: 201 })
  })

  test('should return statusCode 422 when name is invalid', async () => {
    const { sut } = makeSutFactory()
    const response = await sut.handle({
      body: {
        ...defaultCharacterData,
        name: undefined
      }
    })

    expect(response).toMatchObject({
      statusCode: 422,
      body: {
        message: "Attribute 'name' is invalid!"
      }
    })
  })

  test('should return statusCode 500 when use case return error', async () => {
    const { sut, createCharacterStub } = makeSutFactory()

    jest.spyOn(createCharacterStub, 'execute').
      mockImplementationOnce(async () => failure(new Error('Any error')))

    const response = await sut.handle({ body: defaultCharacterData })

    expect(response).toMatchObject({
      statusCode: 500,
      body: {
        cause: new  Error('Any error'),
        message: 'Internal server error'
      }
    })    
  })


})