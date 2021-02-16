import { NotFoundError, RepositoryInternalError } from '@/data/error'
import {
  FindCharacterByIdRepository
} from '@/data/repository/character/FindCharacterByIdRepository'
import { CharacterResponse } from '@/domain/model/character/CharacterData'
import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { Either, failure, success } from '@/shared/Either'

import { CharacterOrm } from '@/infrastructure/database/orm/model/CharacterOrm'

import { Connection } from 'typeorm'

export class FindCharacterByIdORMRepository implements FindCharacterByIdRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

  async execute (id: string): Promise<Either<NotFoundError | RepositoryInternalError, CharacterResponse>> {
    try {
      const character = await this.connectionDatabase.connection()
        .getRepository(CharacterOrm)
        .createQueryBuilder('character')
        .where('character.id = :id', { id })
        .getOne()

      if (character) {
        return success({
          id: character.id,
          name: character.name,
          description: character.description,
          topImage: character.topImage,
          profileImage: character.profileImage,
          comics: character.comics
        })
      }
      return failure(new NotFoundError(`Cannot found character by id equals '${id}'!`))
    } catch (error) {
      return failure(new RepositoryInternalError(error))
    }
  }
}
