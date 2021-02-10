import { User } from '@/domain/model/user/User'
import { StatusUser } from '@/domain/model/user/StatusUser'

describe('User', () => {
  test('should create user instance with success', () => {
    const response = User.create({
      name: 'Valid Name',
      email: 'valid@example.com',
      password: 'Valid@Password'
    })

    expect(response.value as User).toMatchObject({
      name: { value: 'Valid Name' },
      email: { value: 'valid@example.com' },
      password: { value: 'Valid@Password' },
      comicsReactions: [],
      charactersReactions: [],
      profileImage: undefined,
      status: StatusUser.CREATED,
      createAt: expect.any(Date)
    })
  })

  test('should return invalid param error when name is invalid', () => {
    const response = User.create({
      name: 'er',
      email: 'valid@example.com',
      password: 'Valid@Password'
    })

    expect(response.isFailure()).toBe(true)
    expect(response.isSuccess()).toBe(false)
    expect(response.value).toMatchObject({
      message: "Attribute 'name' equals 'er' is invalid!"
    })
  })

  test('should return invalid param error when email is invalid', () => {
    const response = User.create({
      name: 'Valid Name',
      email: 'valid-example.com',
      password: 'Valid@Password'
    })

    expect(response.isFailure()).toBe(true)
    expect(response.isSuccess()).toBe(false)
    expect(response.value).toMatchObject({
      message: "Attribute 'email' equals 'valid-example.com' is invalid!"
    })
  })

  test('should return invalid param error when password is invalid', () => {
    const response = User.create({
      name: 'Valid Name',
      email: 'valid@example.com',
      password: 'Err'
    })

    expect(response.isFailure()).toBe(true)
    expect(response.isSuccess()).toBe(false)
    expect(response.value).toMatchObject({
      message: "Attribute 'password' equals 'Err' is invalid!"
    })
  })
})
