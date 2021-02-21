import { Either, failure, success } from '@/shared/Either'
import { InvalidParamError } from '@/domain/errors'
import { FavoriteComicData } from '@/domain/model/user/UserData'
import { UserFavoriteComic } from '@/domain/usecase/user/UserFavoriteComic'
import { UserFavoriteComicRepository } from '@/data/repository/user/UserFavoriteComicRepository'
import { FindComicByIdRepository } from '@/data/repository/comic/FindComicByIdRepository'

export class DbUserFavoriteComic implements UserFavoriteComic {
  private readonly userFavoriteComicRepo: UserFavoriteComicRepository
  private readonly findComicByIdRepo: FindComicByIdRepository

  constructor (userFavoriteComicRepo: UserFavoriteComicRepository,
    findComicByIdRepo: FindComicByIdRepository) {
    this.findComicByIdRepo = findComicByIdRepo
    this.userFavoriteComicRepo = userFavoriteComicRepo
  }

  async execute (data: FavoriteComicData): Promise<Either<InvalidParamError, void>> {
    const comic = await this.findComicByIdRepo.execute(data.comicId)

    if (comic.isSuccess()) {
      const response = await this.userFavoriteComicRepo.favoriteComic(data)
      if (response.isSuccess()) {
        return success()
      }
      return failure(response.value)
    }

    return failure(comic.value)
  }
}
