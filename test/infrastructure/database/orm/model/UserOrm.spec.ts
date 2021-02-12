import { StatusUser } from '@/domain/model/user/StatusUser'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'

describe('UserOrm', () => {
  test('should create user instance with success', () => {
    const response = UserOrm.create({
      name: 'Valid Name',
      email: 'valid@example.com',
      password: 'Valid@Password'
    })

    expect(response.value as UserOrm).toMatchObject({
      name: 'Valid Name',
      email: 'valid@example.com',
      password: 'Valid@Password',
      status: StatusUser.CREATED,
      createAt: expect.any(Date)
    })
  })

  test('should return invalid param error when name is invalid', () => {
    const response = UserOrm.create({
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
    const response = UserOrm.create({
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
    const response = UserOrm.create({
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
