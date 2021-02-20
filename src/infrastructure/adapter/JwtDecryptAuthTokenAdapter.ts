import jwt from 'jsonwebtoken'

import { DecryptError } from '@/data/error'
import { DecryptAuthToken } from '@/data/protocol/DecryptAuthToken'
import { Either, failure, success } from '@/shared/Either'

export class JwtDecryptAuthTokenAdapter implements DecryptAuthToken {
  async execute (token: string): Promise<Either<DecryptError, string>> {
    try {
      const decoded = await jwt.decode(token, { complete: true })
      if (decoded) {
        const data = JwtDecryptAuthTokenAdapter.getTokenPayload(decoded)
        if (data) { return success(data) }
      }
      return failure(new DecryptError('Unable to decrypt token'))
    } catch (e) {
      return failure(new DecryptError(e.message))
    }
  }

  private static getTokenPayload (decoded: any): string {
    if ('payload' in decoded) {
      return decoded.payload.id
    }
    return null
  }
}
