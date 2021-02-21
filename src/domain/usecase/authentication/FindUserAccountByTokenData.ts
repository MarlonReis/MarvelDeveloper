import { AuthResponse } from '@/domain/model/user/AuthenticationData'
import { Either } from '@/shared/Either'
import { NotFoundError, UnauthorizedAccessError } from '@/domain/errors'

export interface FindUserAccountByTokenData {
  execute: (id: string) => Promise<Either<NotFoundError | UnauthorizedAccessError, AuthResponse>>
}
