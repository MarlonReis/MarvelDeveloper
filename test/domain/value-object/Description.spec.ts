import { Description } from "@/domain/value-object"
import { InvalidParamError } from "@/domain/errors"

describe('Description', () => {
  test('should return success when has value', () => {
    const response = Description.create("Valid value")

    expect(response.isSuccess()).toBe(true)
    expect((response.value as Description).getValue()).toBe("Valid value")
    expect(response.value as Description).toMatchObject({
      value: "Valid value"
    })
  })

  test('should return failure when value is undefined', () => {
    const response = Description.create(undefined)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new InvalidParamError('description', undefined))
  })

  test('should return failure when value not have 3 characters', () => {
    const response = Description.create('ab')

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new InvalidParamError('description', 'ab'))
  })

})