import { FindComicByIdRepository } from '@/data/repository/comic/FindComicByIdRepository'
import { ComicResponse } from '@/domain/model/comic/ComicData'
import { FindComicById } from '@/domain/usecase/comic/FindComicById'
import { NotFoundError } from '@/domain/errors'
import { Either } from '@/shared/Either'

export class DbFindComicById implements FindComicById {
  private readonly findComicByIdRepo: FindComicByIdRepository

  constructor (repo: FindComicByIdRepository) {
    this.findComicByIdRepo = repo
  }

  async execute (id: string): Promise<Either<NotFoundError, ComicResponse>> {
    return await this.findComicByIdRepo.execute(id)
  }
}
