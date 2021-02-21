import { DecryptError, NotFoundError } from '@/data/error'
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

  async execute (token: string, role: Role): Promise<Either<NotFoundError | DecryptError, AuthResponse>> {
    const responseToken = await this.decryptAuthToken.execute(token)
    if (responseToken.isSuccess()) {
      const response = await this.findUserAccountByIdRepo.execute(responseToken.value)
      if (response.isSuccess()) {
        return success({ id: response.value.id })
      }
      return failure(response.value)
    }
    return failure(responseToken.value)
  }
}
