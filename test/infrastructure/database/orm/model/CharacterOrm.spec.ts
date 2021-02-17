import { InvalidParamError } from "@/domain/errors"
import { CharacterOrm } from "@/infrastructure/database/orm/model/CharacterOrm"

const defaultCharacterProp = {
  name: 'Any Name',
  description: 'Any Description',
  topImage: 'https://anyurl.com/top-image.png',
  profileImage: 'https://anyurl.com/profile-image.png'
}

describe('CharacterOrm', () => {
 
  test('should create character class instance', () => {
    const response = CharacterOrm.create(defaultCharacterProp)
    expect(response.isSuccess()).toBe(true)
    expect(response.value).toBeInstanceOf(CharacterOrm)
    expect(response.value).toEqual(defaultCharacterProp)
  })

  test('should return failure when name is invalid', () => {
    const response = CharacterOrm.create({
      ...defaultCharacterProp,
      name:'An'
    })
   
    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidParamError)
    expect(response.value).toMatchObject({
      message:"Attribute 'name' equals 'An' is invalid!"
    })
  })

  test('should return failure when path topImage is invalid', () => {
    const response = CharacterOrm.create({
      ...defaultCharacterProp,
      topImage:'invalid-path'
    })
   
    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidParamError)
    expect(response.value).toMatchObject({
      message:"Attribute 'topImage' equals 'invalid-path' is invalid!"
    })
  })

  test('should return failure when profileImage is invalid', () => {
    const response = CharacterOrm.create({
      ...defaultCharacterProp,
      profileImage:'invalid-path'
    })
   
    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(InvalidParamError)
    expect(response.value).toMatchObject({
      message:"Attribute 'profileImage' equals 'invalid-path' is invalid!"
    })
  })


})
