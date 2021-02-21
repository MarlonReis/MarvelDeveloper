import { DecryptError } from '@/data/error'
import { NotFoundError, UnauthorizedAccessError } from '@/domain/errors'
import { DecryptAuthToken } from '@/data/protocol/DecryptAuthToken'
import { FindUserAccountByIdRepository } from '@/data/repository/user/FindUserAccountByIdRepository'
import { Role, AuthResponse } from '@/domain/model/user/AuthenticationData'
import {
  FindUserAccountByTokenData
} from '@/domain/usecase/authentication/FindUserAccountByTokenData'
import { Either, failure, success } from '@/shared/Either'

export class DbFindUserAccountByTokenData implements FindUserAccountByTokenData {
  private readonly findUserAccountByIdRepo: FindUserAccountByIdRepository
  private readonly decryptAuthToken: DecryptAuthToken

  constructor (decryptAuthToken: DecryptAuthToken, findUserAccountByIdRepo: FindUserAccountByIdRepository) {
    this.decryptAuthToken = decryptAuthToken
    this.findUserAccountByIdRepo = findUserAccountByIdRepo
  }

  async execute (id: string, role: Role): Promise<Either<NotFoundError | UnauthorizedAccessError | DecryptError, AuthResponse>> {
    const responseToken = await this.decryptAuthToken.execute(id)
    if (responseToken.isSuccess()) {
      const response = await this.findUserAccountByIdRepo.execute(responseToken.value)
      if (response.isSuccess()) {
        if (response.value.role === role) {
          return success({
            id: response.value.id,
            role: response.value.role
          })
        } else {
          return failure(new UnauthorizedAccessError(role))
        }
      }
      return failure(response.value)
    }
    return failure(responseToken.value)
  }
}
