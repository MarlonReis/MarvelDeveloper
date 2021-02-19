import { CreateCharacter } from '@/domain/usecase/character/CreateCharacter'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { createSuccess, internalServerError, unProcessableEntity } from '@/presentation/helper'
import { CharacterValidationData } from '@/domain/model/character/CharacterData'
import { MissingParamError } from '@/presentation/error'

export class CreateCharacterController implements Controller {
  private readonly createCharacter: CreateCharacter

  constructor (createCharacter: CreateCharacter) {
    this.createCharacter = createCharacter
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'description', 'topImage', 'profileImage']

    for (const field of requiredFields) {
      const value = request.body[field]
      if (CharacterValidationData[field](value).isFailure()) {
        return unProcessableEntity(new MissingParamError(field))
      }
    }

    const response = await this.createCharacter.execute(request.body)
    if (response.isSuccess()) {
      return createSuccess()
    }

    return internalServerError(response.value)
  }
}
