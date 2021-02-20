import jwt from 'jsonwebtoken'

import { TokenGeneratorError } from '@/data/error/TokenGeneratorError'
import { TokenGenerator } from '@/data/protocol/TokenGenerator'
import { Either, failure, success } from '@/shared/Either'

export class JwtTokenGeneratorAdapter implements TokenGenerator {
  private readonly secretKey: string

  constructor (secretKey: string) {
    this.secretKey = secretKey
  }

  async execute (data: string): Promise<Either<TokenGeneratorError, string>> {
    try {
      const response = await jwt.sign({ id: data }, this.secretKey)
      return success(response)
    } catch (err) {
      return failure(new TokenGeneratorError())
    }
  }
}
