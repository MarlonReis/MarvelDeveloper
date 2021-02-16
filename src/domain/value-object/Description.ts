import { Either, failure, success } from '@/shared/Either'
import { InvalidParamError } from '@/domain/errors'

export class Description {
    public readonly value: string

    private constructor (description: string) {
        this.value = description
        Object.freeze(this)
    }

    static create (description: string): Either<InvalidParamError, Description> {
        if (/.{3,}/.test(description)) {
            return success(new Description(description))
        }

        return failure(new InvalidParamError('description', description))
    }

    getValue (): string {
        return this.value
    }
}
