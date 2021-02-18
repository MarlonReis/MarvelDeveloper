import { Published } from "@/domain/value-object/Published"
import { InvalidParamError } from "@/domain/errors"

describe('Published', () => {
  test('should return success when received correct param', () => {
    const response = Published.create('2021-04-20')
    const date = (response.value as Published).getValue()

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toBeInstanceOf(Published)

    expect(date.getFullYear()).toBe(2021)
    expect(date.getUTCMonth()).toBe(3)
    expect(date.getUTCDate()).toBe(20)
  })


  test('should return failure when date format is invalid', () => {
    expect(Published.create('20-04-20').isFailure()).toBe(true)
    expect(Published.create('2021.04.20').isFailure()).toBe(true)
    expect(Published.create('22/01/2020').isFailure()).toBe(true)
  })

  test('should return failure when date is invalid', () => {
    const response = Published.create('2021/30/30')

    expect(response.value).toEqual(new InvalidParamError('published', '2021/30/30'))
    expect(response.value).toMatchObject({
      message: "Attribute 'published' equals '2021/30/30' is invalid!"
    })
    expect(response.isFailure()).toBe(true)
    expect(Published.create('2021-01-32').isFailure()).toBe(true)
  })

})