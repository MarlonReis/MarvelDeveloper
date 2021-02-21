import { FavoriteComicData } from '@/domain/model/user/UserData'
import { InvalidParamError } from '@/domain/errors'
import { Either } from '@/shared/Either'

export interface UserFavoriteComic {
  execute: (data: FavoriteComicData) => Promise<Either<InvalidParamError, void>>
}
