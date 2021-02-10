import { InvalidParamError } from '@/domain/errors'
import { Password } from '@/domain/value-object/Password'

describe('Password', () => {
    test('should create valid password', () => {
        const result = Password.create('Valid-Password')
        expect(result.isSuccess()).toBe(true)
        expect(result.value).toBeInstanceOf(Password)
        expect((result.value as any).getValue()).toBe('Valid-Password')
    })

    test('should return failure equals true when password is invalid', () => {
        const result = Password.create('invalid')
        expect(result.isFailure()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidParamError)
    })

    test('should return failure equals true when password is undefined', () => {
        const result = Password.create(undefined)
        expect(result.isFailure()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidParamError)
    })

    test('should return password value', () => {
        const result = Password.create('Valid@Password')
        const password = result.value
        expect(password).toMatchObject({
            value: 'Valid@Password'
        })
    })

    test('should return message error', () => {
        const result = Password.create('Valid')
        const password = result.value
        expect(password).toMatchObject({
            message: "Attribute 'password' equals 'Valid' is invalid!"
        })
    })

    test('should return failure is true when password is less then 8 characters', () => {
        const result = Password.create('error')
        expect(result.isFailure()).toBe(true)
        expect(result.value).toBeInstanceOf(InvalidParamError)
    })
})
