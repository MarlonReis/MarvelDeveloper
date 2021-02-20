import { TokenGeneratorError } from '@/data/error/TokenGeneratorError'
import { Either } from '@/shared/Either'

export interface TokenGenerator {
  execute: (data: string) => Promise<Either<TokenGeneratorError, string>>
}
