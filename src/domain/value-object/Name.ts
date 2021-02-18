import { Either, success, failure } from '@/shared/Either'
import { InvalidParamError } from '@/domain/errors'

export class Name {
    public readonly value: string

    private constructor (name: string) {
        this.value = name
        Object.freeze(this)
    }

    static create (attributeName: string, name: string): Either<InvalidParamError, Name> {
        if (name && /.{3,}/.test(name)) {
            return success(new Name(name))
        }
        return failure(new InvalidParamError(attributeName, name))
    }

    getValue (): string {
        return this.value
    }
}
