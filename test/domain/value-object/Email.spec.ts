import { InvalidParamError } from '@/domain/errors'
import { Email } from '@/domain/value-object/Email'
import { Either } from '@/shared/Either'

describe('Email', () => {
    test('should create valid email when receive valid param', () => {
        const result = Email.create('valid@email.com.br')
        expect(result.isSuccess()).toBe(true)
        expect(result.value).toBeInstanceOf(Email)
        expect((result.value as any).getValue()).toBe('valid@email.com.br')
    })

    test('should return error message when not contains @', () => {
        const result: Either<InvalidParamError, Email> = Email.create('valid-email.com.br')
        const email = result.value
        expect(email).toMatchObject({ message: "Attribute 'email' equals 'valid-email.com.br' is invalid!" })
    })

    test('should return error message when params is empty', () => {
        const result: Either<InvalidParamError, Email> = Email.create('')
        expect(result.isSuccess()).toBe(false)
        expect(result.isFailure()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidParamError)
    })

    test('should failure is true when email is undefined', () => {
        const result = Email.create(undefined)
        expect(result.isSuccess()).toBe(false)
        expect(result.isFailure()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidParamError)
    })

    test('should failure is true when email is null', () => {
        const result = Email.create(null)
        expect(result.isSuccess()).toBe(false)
        expect(result.isFailure()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidParamError)
    })

    test('should failure is true when email has is less 3 character before @', () => {
        const result = Email.create('aa@com.br')
        expect(result.isSuccess()).toBe(false)
        expect(result.isFailure()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidParamError)
    })

    test('should failure is true when email has more then 20 characters before @', () => {
        const result = Email.create('aaaaaaaaaaaaaaaaaaaaxx@invalid.com.br')
        expect(result.isSuccess()).toBe(false)
        expect(result.isFailure()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidParamError)
    })

    test('should failure is true when email has more then 20 character after @', () => {
        const result = Email.create('invalid@aaaaaaaaaaaaaaaaaaaaxx.com')
        expect(result.isSuccess()).toBe(false)
        expect(result.isFailure()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidParamError)
    })

    test('should failure is true when email is less 3 character after @', () => {
        const result = Email.create('xxxxx@co.br')
        expect(result.isSuccess()).toBe(false)
        expect(result.isFailure()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidParamError)
    })

    test('should failure is true when email ends with less than 2 letters after the period', () => {
        const result = Email.create('invalid@email.b')
        expect(result.isSuccess()).toBe(false)
        expect(result.isFailure()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidParamError)
    })
})
