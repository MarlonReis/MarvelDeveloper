import { Either } from '@/shared/Either'
import { InvalidParamError } from '@/domain/errors'
import { CreateUserData } from '@/domain/model/user/UserData'

export interface CreateUserAccount {
  execute: (data: CreateUserData) => Promise<Either<InvalidParamError, void>>
}
