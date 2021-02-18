import { InvalidParamError } from '@/domain/errors'
import { Name } from '@/domain/value-object/Name'

describe('Name', () => {
    test('should be create valid name', () => {
        const sut = Name.create('name', 'Any Name')

        expect(sut.isSuccess()).toBe(true)
        expect(sut.value).toBeInstanceOf(Name)
        expect((sut.value as any).getValue()).toBe('Any Name')
    })

    test('should return failure when nome have only two characters', () => {
        const sut = Name.create('name', 'An')

        expect(sut.isSuccess()).toBe(false)
        expect(sut.isFailure()).toBe(true)
        expect(sut.value).toBeInstanceOf(InvalidParamError)
    })

    test('should return failure when nome undefined', () => {
        const sut = Name.create('name', undefined)
        expect(sut.isFailure()).toBe(true)
    })

    test('should return name value', () => {
        const result = Name.create('name', 'Valid Name')
        const name = result.value
        expect(name).toMatchObject({
            value: 'Valid Name'
        })
    })

    test('should return error message', () => {
        const result = Name.create('name','an')
        const name = result.value
        expect(name).toMatchObject({
            message: "Attribute 'name' equals 'an' is invalid!"
        })
    })
})
