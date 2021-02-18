import { Edition } from "@/domain/value-object"
import { InvalidParamError } from "@/domain/errors"

describe('Edition', () => {
  test('should return success when receive an number', () => {
    const response = Edition.create('04')

    expect(response.isSuccess()).toBe(true)

    expect((response.value as Edition).getValue()).toBe(4)
    expect(response.value).toBeInstanceOf(Edition)
    expect(response.value).toMatchObject({ value: 4 })
  })

  test('should return failure when receive undefined', () => {
    const response = Edition.create(undefined)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidParamError)
    expect(response.value).toMatchObject({
      message: "Attribute 'edition' equals 'undefined' is invalid!"
    })
  })

  test('should return failure when parameter is greater than 4 digits', () => {
    const response = Edition.create("10142")

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidParamError)
    expect(response.value).toMatchObject({
      message: "Attribute 'edition' equals '10142' is invalid!"
    })
  })

})