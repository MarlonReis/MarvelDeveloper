import { Either, success } from '@/shared/Either'
import { InvalidParamError } from '@/domain/errors'
import { FavoriteComicData } from '@/domain/model/user/UserData'
import { UserFavoriteComic } from '@/domain/usecase/user/UserFavoriteComic'
import { UserFavoriteComicRepository } from '@/data/repository/user/UserFavoriteComicRepository'
import { FindCharacterByIdRepository } from '@/data/repository/character/FindCharacterByIdRepository'

export class DbUserFavoriteComic implements UserFavoriteComic {
  private readonly userFavoriteComicRepo: UserFavoriteComicRepository
  private readonly findCharacterByIdRepo: FindCharacterByIdRepository

  constructor (userFavoriteComicRepo: UserFavoriteComicRepository, findCharacterByIdRepo: FindCharacterByIdRepository) {
    this.findCharacterByIdRepo = findCharacterByIdRepo
    this.userFavoriteComicRepo = userFavoriteComicRepo
  }

  async execute (data: FavoriteComicData): Promise<Either<InvalidParamError, void>> {
    return success()
  }
}
