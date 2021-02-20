import { Either } from '@/shared/Either'
import { DifferentPasswordError, InvalidPasswordParameterError } from '@/data/error'

export interface ComparePassword {
  execute: (cleanPassword: string, encryptedPassword: string) => Promise<Either<InvalidPasswordParameterError | DifferentPasswordError, void>>
}
