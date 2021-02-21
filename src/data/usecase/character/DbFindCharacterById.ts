import { RepositoryInternalError } from '@/data/error'
import { NotFoundError } from '@/domain/errors'
import {
  FindCharacterByIdRepository
} from '@/data/repository/character/FindCharacterByIdRepository'
import { CharacterResponse } from '@/domain/model/character/CharacterData'
import { FindCharacterById } from '@/domain/usecase/character/FindCharacterById'
import { Either } from '@/shared/Either'

export class DbFindCharacterById implements FindCharacterById {
  private readonly findCharacterByIdRepo: FindCharacterByIdRepository

  constructor (repo: FindCharacterByIdRepository) {
    this.findCharacterByIdRepo = repo
  }

  async execute (id: string): Promise<Either<NotFoundError | RepositoryInternalError, CharacterResponse>> {
    return await this.findCharacterByIdRepo.execute(id)
  }
}
