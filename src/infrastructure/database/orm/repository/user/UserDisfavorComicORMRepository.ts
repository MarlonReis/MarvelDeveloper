import { UserDisfavorComicRepository } from '@/data/repository/comic/UserDisfavorComicRepository'
import { ConnectionDatabase } from '@/infrastructure/database/protocol/ConnectionDatabase'
import { FavoriteComicData } from '@/domain/model/user/UserData'
import { RepositoryInternalError } from '@/data/error'
import { InvalidParamError } from '@/domain/errors'
import { Either, failure, success } from '@/shared/Either'

import { Connection } from 'typeorm'
import { ComicOrm } from '@/infrastructure/database/orm/model/ComicOrm'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'

export class UserDisfavorComicORMRepository implements UserDisfavorComicRepository {
  private readonly connectionDatabase: ConnectionDatabase<Connection>

  constructor (connection: ConnectionDatabase<Connection>) {
    this.connectionDatabase = connection
  }

 async execute (data: FavoriteComicData): Promise<Either<InvalidParamError | RepositoryInternalError, void>> {
  try {
    const connection = this.connectionDatabase.connection()

    const comicRepository = connection.getRepository(ComicOrm)
    const userRepository = connection.getRepository(UserOrm)

    const userResponse = await userRepository.findOne(data.userId)
    const comicResponse = await comicRepository.findOne(data.comicId)

    userResponse.favoriteComics = UserOrm.doDisfavorComic(userResponse.favoriteComics, comicResponse)

    await userRepository.save(userResponse)
    return success()
  } catch (error) {
    return failure(new RepositoryInternalError(error))
  }
  }
}
