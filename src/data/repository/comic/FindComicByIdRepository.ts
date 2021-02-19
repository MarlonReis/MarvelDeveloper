import { ComicResponse } from '@/domain/model/comic/ComicData'
import { NotFoundError, RepositoryInternalError } from '@/data/error'
import { Either } from '@/shared/Either'

export interface FindComicByIdRepository {
  execute: (id: string) => Promise<Either<NotFoundError | RepositoryInternalError, ComicResponse>>
}
