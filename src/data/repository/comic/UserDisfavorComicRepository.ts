import { RepositoryInternalError } from '@/data/error'
import { InvalidParamError } from '@/domain/errors'
import { FavoriteComicData } from '@/domain/model/user/UserData'
import { Either } from '@/shared/Either'

export interface UserDisfavorComicRepository {
  execute: (data: FavoriteComicData) => Promise<Either<InvalidParamError | RepositoryInternalError, void>>
}
