import { CreateCharacterRepository } from '@/data/repository/character/CreateCharacterRepository'
import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { CreateCharacterData } from '@/domain/model/character/CharacterData'
import { RepositoryInternalError } from '@/data/error'
import { Either, failure, success } from '@/shared/Either'
import { Connection } from 'typeorm'

import { CharacterOrm } from '@/infrastructure/database/orm/model/CharacterOrm'
import { InvalidParamError } from '@/domain/errors'

export class CreateCharacterORMRepository implements CreateCharacterRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

  async execute (data: CreateCharacterData): Promise<Either<RepositoryInternalError | InvalidParamError, void>> {
    try {
      const character = CharacterOrm.create(data)

      if (character.isSuccess()) {
        await this.connectionDatabase.connection()
          .createQueryBuilder()
          .insert().into(CharacterOrm)
          .values(character.value).execute()
        return success()
      }
      return failure(character.value)
    } catch (error) {
      return failure(new RepositoryInternalError(error))
    }
  }
}
