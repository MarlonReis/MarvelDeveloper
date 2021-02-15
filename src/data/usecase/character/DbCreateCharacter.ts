import { CreateCharacterRepository } from '@/data/repository/character/CreateCharacterRepository'
import { CreateCharacterData } from '@/domain/model/character/CharacterData'
import { CreateCharacter } from '@/domain/usecase/character/CreateCharacter'
import { RepositoryInternalError } from '@/data/error'
import { InvalidParamError } from '@/domain/errors'
import { Either } from '@/shared/Either'

export class DbCreateCharacter implements CreateCharacter {
  private readonly repository: CreateCharacterRepository

  constructor (repo: CreateCharacterRepository) {
    this.repository = repo
  }

  async execute (data: CreateCharacterData): Promise<Either<InvalidParamError | RepositoryInternalError, void>> {
    return await this.repository.execute(data)
  }
}
