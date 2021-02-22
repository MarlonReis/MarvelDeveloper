import { UserDisfavorComicRepository } from '@/data/repository/comic/UserDisfavorComicRepository'
import { InvalidParamError } from '@/domain/errors'
import { FavoriteComicData } from '@/domain/model/user/UserData'
import { UserDisfavorComic } from '@/domain/usecase/user/UserDisfavorComic'
import { Either, failure, success } from '@/shared/Either'

export class DbUserDisfavorComic implements UserDisfavorComic {
  private readonly userDisfavorComicRepo: UserDisfavorComicRepository

  constructor (repo: UserDisfavorComicRepository) {
    this.userDisfavorComicRepo = repo
  }

  async execute (data: FavoriteComicData): Promise<Either<InvalidParamError, void>> {
    const response = await this.userDisfavorComicRepo.execute(data)
    if (response.isSuccess()) {
      return success()
    }
    return failure(response.value)
  }
}
