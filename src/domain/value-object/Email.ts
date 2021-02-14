import { Either, failure, success } from '@/shared/Either'
import { InvalidParamError } from '@/domain/errors'

const emailValid = /^[a-z0-9_-]{3,20}@[a-z0-9_-]{3,20}\.\S{2,6}/

export class Email {
    public readonly value: string

    private constructor (email: string) {
        this.value = email
        Object.freeze(this)
    }

    isEqual (email: string): boolean {
        if (email) {
            return this.value === email
        }
        return false
    }

    static create (email: string): Either<InvalidParamError, Email> {
        if (emailValid.test(email)) {
            return success(new Email(email))
        }

        return failure(new InvalidParamError('email', email))
    }

    getValue (): string {
        return this.value
    }
}
