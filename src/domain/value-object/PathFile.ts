import { InvalidParamError } from '@/domain/errors'
import { Either, failure, success } from '@/shared/Either'

export class PathFile {
  private readonly value: string

  private constructor (path: string) {
    this.value = path
    Object.freeze(this)
  }

  static create (attribute: string, path: string): Either<InvalidParamError, PathFile> {
    if (path && /.{8,}/.test(path)) {
      return success(new PathFile(path))
    }
    return failure(new InvalidParamError(attribute, path))
  }

  getValue (): string {
    return this.value
  }
}
