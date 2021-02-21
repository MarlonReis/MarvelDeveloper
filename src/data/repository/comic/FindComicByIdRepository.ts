import { ComicResponse } from '@/domain/model/comic/ComicData'
import { RepositoryInternalError } from '@/data/error'
import { NotFoundError } from '@/domain/errors'
import { Either } from '@/shared/Either'

export interface FindComicByIdRepository {
  execute: (id: string) => Promise<Either<NotFoundError | RepositoryInternalError, ComicResponse>>
}
