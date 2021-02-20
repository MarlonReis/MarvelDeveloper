import { DecryptError, NotFoundError } from '@/data/error'
import { DecryptAuthToken } from '@/data/protocol/DecryptAuthToken'
import { Role, AuthResponse } from '@/domain/model/user/AuthenticationData'
import {
  FindUserAccountByTokenData
} from '@/domain/usecase/authentication/FindUserAccountByTokenData'
import { Either, failure, success } from '@/shared/Either'

export class DbFindUserAccountByTokenData implements FindUserAccountByTokenData {
  private readonly decryptAuthToken: DecryptAuthToken

  constructor (decryptAuthToken: DecryptAuthToken) {
    this.decryptAuthToken = decryptAuthToken
  }

  async execute (token: string, role: Role): Promise<Either<NotFoundError | DecryptError, AuthResponse>> {
    const responseToken = await this.decryptAuthToken.execute(token)
    if (responseToken.isSuccess()) {
      return success({ id: 'ok' })
    }
    return failure(responseToken.value)
  }
}
