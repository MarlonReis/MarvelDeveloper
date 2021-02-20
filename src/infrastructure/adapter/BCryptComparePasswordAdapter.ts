import bcrypt from 'bcrypt'

import { InvalidPasswordParameterError, DifferentPasswordError } from '@/data/error'
import { ComparePassword } from '@/data/protocol/ComparePassword'
import { Either, failure, success } from '@/shared/Either'

export class BCryptComparePasswordAdapter implements ComparePassword {
  async execute (cleanPassword: string, encryptedPassword: string): Promise<Either<InvalidPasswordParameterError | DifferentPasswordError, void>> {
    try {
      const response = await bcrypt.compare(cleanPassword, encryptedPassword)
      if (response) {
        return success()
      }
      return failure(new DifferentPasswordError())
    } catch (err) {
      return failure(new InvalidPasswordParameterError(err.message))
    }
  }
}
