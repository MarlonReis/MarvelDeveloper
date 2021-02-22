import { InvalidParamError } from '@/domain/errors'
import { FavoriteComicData } from '@/domain/model/user/UserData'
import { Either } from '@/shared/Either'

export interface UserDisfavorComic {
  execute: (data: FavoriteComicData) => Promise<Either<InvalidParamError, void>>
}
