import { Either, failure, success } from '@/shared/Either'
import { InvalidParamError } from '@/domain/errors'

export class Password {
    public readonly value: string

    private constructor(password: string) {
        this.value = password
        Object.freeze(this)
    }

    static create(password: string): Either<InvalidParamError, Password> {
        if (password && /.{8,}/.test(password)) {
            return success(new Password(password))
        }
        return failure(new InvalidParamError('password', password))
    }

    getValue(): string {
        return this.value
    }
}
