import { PathFile } from "@/domain/value-object"

describe('PathFile', () => {
  test('should return success', () => {
    const path = PathFile.create('anyAttribute', "http://anyurl.com/image.png")

    expect(path.isSuccess()).toBe(true)
    expect(path.value).toMatchObject({
      value: 'http://anyurl.com/image.png'
    })
  })

  test('should return failure when last word is not a file name', () => {
    const path = PathFile.create('anyAttribute', "http://anyurl.com/image")

    expect(path.isFailure()).toBe(true)
    expect(path.value).toMatchObject({
      message: "Attribute 'anyAttribute' equals 'http://anyurl.com/image' is invalid!"
    })
  })

  test('should return failure when param is undefined', () => {
    const path = PathFile.create('anyAttribute', undefined)

    expect(path.isFailure()).toBe(true)
    expect(path.value).toMatchObject({
      message: "Attribute 'anyAttribute' equals 'undefined' is invalid!"
    })
  })

  test('should return failure when not start with http[s]', () => {
    const path = PathFile.create('anyAttribute', "anyurl.com/image.png")

    expect(path.isFailure()).toBe(true)
    expect(path.value).toMatchObject({
      message: "Attribute 'anyAttribute' equals 'anyurl.com/image.png' is invalid!"
    })
  })

})