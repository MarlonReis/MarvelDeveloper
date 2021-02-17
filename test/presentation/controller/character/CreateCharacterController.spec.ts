import { InvalidParamError } from "@/domain/errors";
import { Either, success } from "@/shared/Either";

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
})