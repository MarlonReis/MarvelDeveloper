import { NotFoundError } from '@/data/error'
import { ComicResponse } from '@/domain/model/comic/ComicData'
import { Either } from '@/shared/Either'

export interface FindComicById {
  execute: (id: string) => Promise<Either<NotFoundError, ComicResponse>>
}
