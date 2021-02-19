import { AuthResponse, Role } from '@/domain/model/user/AuthenticationData'
import { NotFoundError } from '@/data/error'
import { Either } from '@/shared/Either'

export interface FindUserAccountByTokenData {
  execute: (token: string, role: Role) => Promise<Either<NotFoundError, AuthResponse>>
}
