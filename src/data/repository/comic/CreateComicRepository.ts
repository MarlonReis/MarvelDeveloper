import { RepositoryInternalError } from '@/data/error'
import { InvalidParamError } from '@/domain/errors'
import { CreateComicData } from '@/domain/model/comic/ComicData'
import { Either } from '@/shared/Either'

export interface CreateComicRepository {
  execute: (data: CreateComicData) => Promise<Either<InvalidParamError | RepositoryInternalError, void>>
}
