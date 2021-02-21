import { FavoriteComicData } from '@/domain/model/user/UserData'
import { InvalidParamError } from '@/domain/errors'
import { Either } from '@/shared/Either'

export interface UserFavoriteComicRepository {
  favoriteComic: (data: FavoriteComicData) => Promise<Either<InvalidParamError, void>>
}
