import { Role } from '@/domain/model/user/AuthenticationData'
import { StatusUser } from '@/domain/model/user/StatusUser'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'
import { ComicOrm } from './ComicOrm'

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
      createAt: expect.any(Date),
      role: Role.USER
    })
  })


  test('should create admin user instance with success', () => {
    const response = UserOrm.create({
      name: 'Valid Name',
      email: 'valid@example.com',
      password: 'Valid@Password',
      role: Role.ADMIN
    })

    expect(response.value as UserOrm).toMatchObject({
      name: 'Valid Name',
      email: 'valid@example.com',
      password: 'Valid@Password',
      status: StatusUser.CREATED,
      createAt: expect.any(Date),
      role: Role.ADMIN
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



  test('should validate only the information defined', () => {
    const response = UserOrm.update({
      id: 'valid-id',
      name: 'Valid Name',
      email: 'valid@password.com',
      status: StatusUser.DELETED,
      password: 'ValidPassword',
      profileImage: 'path-image'
    })

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toMatchObject({
      id: 'valid-id',
      name: 'Valid Name',
      email: 'valid@password.com',
      status: StatusUser.DELETED,
      password: 'ValidPassword',
      profileImage: 'path-image'
    })
  })

  test('should not valid when not defined', () => {
    const response = UserOrm.update({
      id: 'valid-id'
    })

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toMatchObject({
      id: 'valid-id'
    })
  })

  test('should return failure when email invalid', () => {
    const response = UserOrm.update({
      id: 'valid-id',
      email: 'invalid-email',
    })

    expect(response.isFailure()).toBe(true)
    expect(response.isSuccess()).toBe(false)
    expect(response.value).toMatchObject({
      message: "Attribute 'email' equals 'invalid-email' is invalid!"
    })
  })


  test('should return new favorite list of Comics', () => {
    const myFavorites = [
      { id: 'valid_id_a', title: 'valid_title' },
      { id: 'valid_id_b', title: 'valid_title' }
    ] as ComicOrm[]

    const newComics = { id: 'valid_id_c', title: 'valid_title' } as ComicOrm

    const response = UserOrm.doFavoriteComic(myFavorites, newComics)

    expect(response).toContainEqual(newComics);
    expect(response).toHaveLength(3)
  })

  test('should remove duplicate', () => {
    const myFavorites = [
      { id: 'valid_id_duplicate', title: 'valid_title' },
      { id: 'valid_id_b', title: 'valid_title' }
    ] as ComicOrm[]

    const newComics = { id: 'valid_id_duplicate', title: 'valid_title' } as ComicOrm

    const response = UserOrm.doFavoriteComic(myFavorites, newComics)
    expect(response).toContainEqual(newComics);
    expect(response).toHaveLength(2)
  })


  test('should add my first favorite', () => {
    const myFavorites = undefined

    const newComics = { id: 'valid_id_c', title: 'valid_title' } as ComicOrm

    const response = UserOrm.doFavoriteComic(myFavorites, newComics)

    expect(response).toContainEqual(newComics);
    expect(response).toHaveLength(1)
  })

  test('should return same list when try add undefined', () => {
    const myFavorites = [
      { id: 'valid_id_duplicate', title: 'valid_title' },
      { id: 'valid_id_c', title: 'valid_title' }
    ] as ComicOrm[]

    const response = UserOrm.doFavoriteComic(myFavorites, undefined)

    expect(response).toEqual(expect.arrayContaining(myFavorites))
    expect(response).toHaveLength(2)
  })

  test('should return remove only one item of list', () => {
    const myFavorites = [
      { id: 'valid_id_a', title: 'valid_title' },
      { id: 'valid_id_c', title: 'valid_title' }
    ] as ComicOrm[]

    const element =   { id: 'valid_id_a', title: 'valid_title' } as ComicOrm

    const response = UserOrm.doDisfavorComic(myFavorites, element)

    expect(response).toEqual(expect.arrayContaining([{ id: 'valid_id_c', title: 'valid_title' }]))
    expect(response).toHaveLength(1)
  })


  test('should return same list when comic is undefined', () => {
    const myFavorites = [
      { id: 'valid_id_a', title: 'valid_title' },
      { id: 'valid_id_c', title: 'valid_title' }
    ] as ComicOrm[]

    const response = UserOrm.doDisfavorComic(myFavorites, undefined)

    expect(response).toEqual(myFavorites)
    expect(response).toHaveLength(2)
  })

  test('should return empty list when user not have elements', () => {
    const response = UserOrm.doDisfavorComic(undefined, undefined)
    expect(response).toEqual([])
    expect(response).toHaveLength(0)
  })

  test('should return same list when not contains element in list', () => {
    const myFavorites = [
      { id: 'valid_id_a', title: 'valid_title' },
      { id: 'valid_id_c', title: 'valid_title' }
    ] as ComicOrm[]

    const element =   { id: 'valid_id_d', title: 'valid_title' } as ComicOrm

    const response = UserOrm.doDisfavorComic(myFavorites, element)

    expect(response).toEqual(expect.arrayContaining(myFavorites))
    expect(response).toHaveLength(2)
  })

})
