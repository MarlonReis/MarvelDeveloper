import { DecryptError } from '@/data/error'
import { NotFoundError, UnauthorizedAccessError } from '@/domain/errors'
import { DecryptAuthToken } from '@/data/protocol/DecryptAuthToken'
import { FindUserAccountByIdRepository } from '@/data/repository/user/FindUserAccountByIdRepository'
import { Role, AuthResponse } from '@/domain/model/user/AuthenticationData'
import {
  FindUserAccountByTokenData
} from '@/domain/usecase/authentication/FindUserAccountByTokenData'
import { Either, failure, success } from '@/shared/Either'

const hasPermission = (basicRole: Role, userPermissions: Role) => {
  if (userPermissions === Role.ADMIN) {
    return true
  }
  return basicRole === userPermissions
}

export class DbFindUserAccountByTokenData implements FindUserAccountByTokenData {
  private readonly findUserAccountByIdRepo: FindUserAccountByIdRepository
  private readonly decryptAuthToken: DecryptAuthToken
  private readonly role: Role

  constructor (decryptAuthToken: DecryptAuthToken,
    findUserAccountByIdRepo: FindUserAccountByIdRepository,
    role: Role) {
    this.decryptAuthToken = decryptAuthToken
    this.findUserAccountByIdRepo = findUserAccountByIdRepo
    this.role = role
  }

  async execute (id: string): Promise<Either<NotFoundError | UnauthorizedAccessError | DecryptError, AuthResponse>> {
    const responseToken = await this.decryptAuthToken.execute(id)
    if (responseToken.isSuccess()) {
      const response = await this.findUserAccountByIdRepo.execute(responseToken.value)
      if (response.isSuccess()) {
        if (hasPermission(this.role, response.value.role)) {
          return success({
            id: response.value.id,
            role: response.value.role
          })
        } else {
          return failure(new UnauthorizedAccessError(this.role))
        }
      }
      return failure(response.value)
    }
    return failure(responseToken.value)
  }
}
