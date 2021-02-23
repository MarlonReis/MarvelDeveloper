import { RepositoryInternalError } from '@/data/error'
import { Pagination } from '@/domain/helper/Pagination'
import { ComicResponse } from '@/domain/model/comic/ComicData'
import { Either } from '@/shared/Either'

export interface FindAllUserFavoriteComicsPageableRepository{
  execute: (userId: string, page: number, limit: number) => Promise<Either<RepositoryInternalError, Pagination<ComicResponse>>>
}
