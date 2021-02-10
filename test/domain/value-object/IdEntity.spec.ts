import { InvalidParamError } from '@/domain/errors'
import { IdEntity } from '@/domain/value-object/IdEntity'

describe('IdEntity', () => {
  test('should create IdEntity with valid id', () => {
    const sut = IdEntity.create('valid-id')

    expect(sut.isSuccess()).toBe(true)
    expect(sut.isFailure()).toBe(false)
    expect((sut.value as any).getValue()).toBe('valid-id')
  })

  test('should return failure when id undefined', () => {
    const sut = IdEntity.create(undefined)

    expect(sut.isFailure()).toBe(true)
    expect(sut.value).toBeInstanceOf(InvalidParamError)
    expect(sut.value).toMatchObject({
      message: "Attribute 'id' equals 'undefined' is invalid!"
    })
  })
})
