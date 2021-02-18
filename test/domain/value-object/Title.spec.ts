import { Title } from "@/domain/value-object"
import { InvalidParamError } from "@/domain/errors"

describe('Title', () => {
  test('should return success when receive correct param', () => {
    const response = Title.create("Valid Title")
   
    expect(response.isSuccess()).toBe(true)
    expect(response.value).toBeInstanceOf(Title)
    expect((response.value as Title).getValue()).toEqual("Valid Title")
    expect(response.value).toMatchObject({
      value: "Valid Title"
    })
  })

  test('should return failure when param is undefined', () => {
    const response = Title.create(undefined)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new InvalidParamError('title', undefined))
    expect(response.value).toMatchObject({
      message: "Attribute 'title' equals 'undefined' is invalid!"
    })
  })

  test('should return failure when param is invalid', () => {
    const response = Title.create("---- --------")
    
    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new InvalidParamError('title', '---- --------'))
    expect(response.value).toMatchObject({
      message: "Attribute 'title' equals '---- --------' is invalid!"
    })
  })

})