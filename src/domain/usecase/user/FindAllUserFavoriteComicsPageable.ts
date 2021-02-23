import { ComicResponse } from '@/domain/model/comic/ComicData'
import { Pagination } from '@/domain/helper/Pagination'
import { NotFoundError } from '@/domain/errors'
import { Either } from '@/shared/Either'

export interface FindAllUserFavoriteComicsPageable {
  execute: (userId: string, page: number, limit: number) => Promise<Either<NotFoundError, Pagination<ComicResponse>>>
}
