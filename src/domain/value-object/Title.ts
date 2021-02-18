import { Either, failure, success } from '@/shared/Either'
import { InvalidParamError } from '@/domain/errors'

export class Title {
  public readonly value: string

  private constructor (title: string) {
      this.value = title
      Object.freeze(this)
  }

  static create (title: string): Either<InvalidParamError, Title> {
      if (title && /^(([A-Za-z]+[/\-']?)*([A-Za-z]+)?\s)+([A-Za-z]+[/\-']?)*([A-Za-z]+)?$/.test(title)) {
          return success(new Title(title))
      }
      return failure(new InvalidParamError('title', title))
  }

  getValue (): string {
      return this.value
  }
}
