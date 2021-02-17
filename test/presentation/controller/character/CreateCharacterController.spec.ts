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



describe('CreateCharacterController', () => {

  test('should create a new character with success', async () => {
    class CreateCharacterStub implements CreateCharacter {
      async execute(data: CreateCharacterData): Promise<Either<InvalidParamError, void>> {
        return success()
      }
    }

    const createCharacterStub = new CreateCharacterStub()
    const sut = new CreateCharacterController(createCharacterStub);

    const response = await sut.handle({ body: defaultCharacterData   })

    expect(response).toEqual({ statusCode: 201 })

  })
})