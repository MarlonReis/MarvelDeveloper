import jwt from 'jsonwebtoken'

import { DecryptError } from '@/data/error'
import { DecryptAuthToken } from '@/data/protocol/DecryptAuthToken'
import { Either, failure, success } from '@/shared/Either'

export class JwtDecryptAuthTokenAdapter implements DecryptAuthToken {
  private readonly secretKey: string

  constructor (secretKey: string) {
    this.secretKey = secretKey
  }

  async execute (token: string = ''): Promise<Either<DecryptError, string>> {
    try {
      const tokenClean = token.replace('Bearer ', '').replace(' ', '')
      const data: any = await jwt.verify(tokenClean, this.secretKey)
      const { id } = data
      return success(id)
    } catch (e) {
      return failure(new DecryptError(e.message))
    }
  }
}
