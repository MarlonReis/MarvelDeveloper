import { UpdateUserData } from '@/domain/model/user/UserData'
import { InvalidParamError } from '@/domain/errors'
import { Either } from '@/shared/Either'

export interface UpdateUserAccount {
  execute: (data: UpdateUserData) => Promise<Either<InvalidParamError, void>>
}
