import { Either } from '@/shared/Either'
import { RepositoryInternalError } from '@/data/error'
import { CreateUserData } from '@/domain/model/user/UserData'

export interface CreateUserAccountRepository {
  execute: (data: CreateUserData) => Promise<Either<RepositoryInternalError, void>>
}
