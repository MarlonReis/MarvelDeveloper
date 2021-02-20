import { NotFoundError, RepositoryInternalError } from '@/data/error'
import { AuthResponse, Role } from '@/domain/model/user/AuthenticationData'
import { Either } from '@/shared/Either'

export interface FindUserAccountByTokenDataRepository {
  execute: (token: string, role: Role) => Promise<Either<NotFoundError | RepositoryInternalError, AuthResponse>>
}
