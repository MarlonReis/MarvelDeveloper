import { RepositoryInternalError } from '@/data/error'
import { Either } from '@/shared/Either'
import { UpdateUserData } from '@/domain/model/user/UserData'

export interface UpdateUserAccountRepository {
  execute: (data: UpdateUserData) => Promise<Either<RepositoryInternalError, void>>
}
