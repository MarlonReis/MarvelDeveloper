import { Either } from '@/shared/Either'
import { NotFoundError } from '@/data/error'

export interface FindUserAccountByEmailRepository {
  execute: (email: string) => Promise<Either<NotFoundError, any>>
}
