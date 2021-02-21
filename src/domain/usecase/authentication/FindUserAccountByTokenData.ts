import { AuthResponse, Role } from '@/domain/model/user/AuthenticationData'
import { Either } from '@/shared/Either'
import { NotFoundError, UnauthorizedAccessError } from '@/domain/errors'

export interface FindUserAccountByTokenData {
  execute: (id: string, role: Role) => Promise<Either<NotFoundError | UnauthorizedAccessError, AuthResponse>>
}
