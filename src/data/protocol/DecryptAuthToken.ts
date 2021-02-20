import { Either } from '@/shared/Either'
import { DecryptError } from '@/data/error'

export interface DecryptAuthToken {
  execute: (data: string) => Promise<Either<DecryptError, string>>
}
