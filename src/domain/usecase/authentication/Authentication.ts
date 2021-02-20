import { NotFoundError } from '@/data/error'
import { AuthData } from '@/domain/model/user/AuthenticationData'
import { Either } from '@/shared/Either'

export interface Authentication {
  execute: (auth: AuthData) => Promise<Either<NotFoundError, string>>
}
