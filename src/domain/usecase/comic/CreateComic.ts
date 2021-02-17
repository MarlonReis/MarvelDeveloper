import { InvalidParamError } from '@/domain/errors'
import { CreateComicData } from '@/domain/model/comic/ComicData'
import { Either } from '@/shared/Either'

export interface CreateComic {
  execute: (data: CreateComicData) => Promise<Either<InvalidParamError, void>>
}
