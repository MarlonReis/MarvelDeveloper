import { EncryptsPassword } from '@/data/protocol/EncryptsPassword'
import { InvalidPasswordParameterError } from '@/data/error'
import { Either, success, failure } from '@/shared/Either'
import bcrypt from 'bcrypt'

export class BCryptEncryptsPasswordAdapter implements EncryptsPassword {
  private readonly saltOrRounds: number

  constructor (saltOrRounds: number) {
    this.saltOrRounds = saltOrRounds
  }

  async execute (password: string): Promise<Either<InvalidPasswordParameterError, string>> {
    try {
      const passwordEncrypted = await bcrypt.hash(password, this.saltOrRounds)
      return success(passwordEncrypted)
    } catch (err) {
      return failure(new InvalidPasswordParameterError(err.message))
    }
  }
}
