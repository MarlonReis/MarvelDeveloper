import { CharacterOrm } from "@/infrastructure/database/orm/model/CharacterOrm"

describe('CharacterOrm', () => {
  test('should create character class instance', () => {
    const response = CharacterOrm.create({
      name: 'Any Name',
      description: 'Any Description',
      topImage: 'any path top image',
      profileImage: 'any path profile image'
    })
    expect(response.isSuccess()).toBe(true)
    expect(response.value).toBeInstanceOf(CharacterOrm)
    expect(response.value).toEqual({
      name: 'Any Name',
      description: 'Any Description',
      topImage: 'any path top image',
      profileImage: 'any path profile image'
    })
  })
})
