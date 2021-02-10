export type Either<F, S> = Failures<F, S> | Success<F, S>

interface SharedResponse<F, S> {
    isFailure: () => this is Failures<F, S>
    isSuccess: () => this is Success<F, S>
    value: any
}
export class Failures<F, S> implements SharedResponse<F, S> {
    private readonly _value: F

    constructor(value: F) {
        this._value = value
    }

    get value(): F {
        return this._value
    }

    isFailure(): this is Failures<F, S> {
        return true
    }

    isSuccess(): this is Success<F, S> {
        return false
    }
}

export class Success<F, S> implements SharedResponse<F, S> {
    private readonly _value: S

    constructor(value: S) {
        this._value = value
    }

    get value(): S {
        return this._value
    }

    isFailure(): this is Failures<F, S> {
        return false
    }

    isSuccess(): this is Success<F, S> {
        return true
    }
}

export const success = <F, S>(s: S): Either<F, S> => new Success<F, S>(s)
export const failure = <F, S>(f: F): Either<F, S> => new Failures<F, S>(f)
