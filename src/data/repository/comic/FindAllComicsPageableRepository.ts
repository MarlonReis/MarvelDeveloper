import { NotFoundError } from '@/domain/errors'
import { Pagination } from '@/domain/helper/Pagination'
import { ComicResponse } from '@/domain/model/comic/ComicData'
import { Either } from '@/shared/Either'

export interface FindAllComicsPageableRepository{
  execute: (page: number, limit: number) => Promise<Either<NotFoundError, Pagination<ComicResponse>>>
}
