import { Either, failure, success } from '@/shared/Either'
import { InvalidParamError } from '@/domain/errors'

const regex = /^\d{4}[/\-\\/\s]?((((0[13578])|(1[02]))[/\-\\/\s]?(([0-2][0-9])|(3[01])))|(((0[469])|(11))[/\-\\/\s]?(([0-2][0-9])|(30)))|(02[/\-\\/\s]?[0-2][0-9]))$/

export class Published {
  public readonly value: Date

  private constructor (published: Date) {
    this.value = published
    Object.freeze(this)
  }

  static create (published: string): Either<InvalidParamError, Published> {
    if (regex.test(published)) {
      return success(new Published(new Date(Date.parse(published))))
    }

    return failure(new InvalidParamError('published', published))
  }
}
