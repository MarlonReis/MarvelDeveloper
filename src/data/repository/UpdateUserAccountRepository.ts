import { RepositoryInternalError } from '@/data/error'
import { Either } from '@/shared/Either'
import { UpdateUserData } from '@/domain/model/user/UserData'
import { InvalidParamError } from '@/domain/errors'

export interface UpdateUserAccountRepository {
  execute: (data: UpdateUserData) => Promise<Either<InvalidParamError | RepositoryInternalError, void>>
}
