import { Either } from '@/shared/Either'
import { NotFoundError } from '@/data/error'
import { UserAccountResponse } from '@/domain/model/user/UserData'

export interface FindUserAccountByEmailRepository {
  execute: (email: string) => Promise<Either<NotFoundError, UserAccountResponse>>
}
