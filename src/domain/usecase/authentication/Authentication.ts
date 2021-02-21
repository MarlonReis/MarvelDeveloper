import { DifferentPasswordError } from '@/data/error'
import { NotFoundError } from '@/domain/errors'
import { AuthData } from '@/domain/model/user/AuthenticationData'
import { Either } from '@/shared/Either'

export interface Authentication {
  execute: (auth: AuthData) => Promise<Either<NotFoundError | DifferentPasswordError, string>>
}
