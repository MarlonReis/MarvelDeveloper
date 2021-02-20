import { DecryptError, NotFoundError } from '@/data/error'
import { DecryptAuthToken } from '@/data/protocol/DecryptAuthToken'
import { FindUserAccountByTokenDataRepository } from '@/data/repository/authentication/FindUserAccountByTokenDataRepository'

import { Role, AuthResponse } from '@/domain/model/user/AuthenticationData'
import {
  FindUserAccountByTokenData
} from '@/domain/usecase/authentication/FindUserAccountByTokenData'
import { Either, failure } from '@/shared/Either'

export class DbFindUserAccountByTokenData implements FindUserAccountByTokenData {
  private readonly findByTokenDataRepo: FindUserAccountByTokenDataRepository
  private readonly decryptAuthToken: DecryptAuthToken

  constructor (decryptAuthToken: DecryptAuthToken, findByTokenDataRepo: FindUserAccountByTokenDataRepository) {
    this.decryptAuthToken = decryptAuthToken
    this.findByTokenDataRepo = findByTokenDataRepo
  }

  async execute (token: string, role: Role): Promise<Either<NotFoundError | DecryptError, AuthResponse>> {
    const responseToken = await this.decryptAuthToken.execute(token)
    if (responseToken.isSuccess()) {
      return await this.findByTokenDataRepo.execute(responseToken.value, role)
    }
    return failure(responseToken.value)
  }
}
