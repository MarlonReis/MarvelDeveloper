import { Either } from '@/shared/Either'
import { InvalidPasswordParameterError } from '@/data/error'

export interface EncryptsPassword {
  execute: (data: string) => Promise<Either<InvalidPasswordParameterError, string>>
}
