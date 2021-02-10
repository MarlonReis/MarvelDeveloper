import { Either, failure, success } from '@/shared/Either'
import { InvalidParamError } from '@/domain/errors'
export class IdEntity {
  private readonly value: string

  private constructor (id: string) {
    this.value = id
    Object.freeze(this)
  }

  static create = (id: string): Either<InvalidParamError, IdEntity> => {
    if (id) {
      return success(new IdEntity(id))
    }
    return failure(new InvalidParamError('id', id))
  }

  getValue (): string {
    return this.value
  }
}
