import { Either, failure, success } from '@/shared/Either'
import { InvalidParamError } from '@/domain/errors'

export class Edition {
    public readonly value: number

    private constructor (edition: number) {
        this.value = edition
        Object.freeze(this)
    }

    static create (edition: string): Either<InvalidParamError, Edition> {
        if (edition && /^[0-9]{1,4}$/.test(edition)) {
            return success(new Edition(parseInt(edition)))
        }
        return failure(new InvalidParamError('edition', edition))
    }

    getValue (): number {
        return this.value
    }
}
