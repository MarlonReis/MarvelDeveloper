import request from 'supertest'
import app from '@/main/express/config/App'

import {
  ConnectionDatabaseFactory
} from '@/main/factories/ConnectionDatabaseFactory'
import { UserOrm } from '@/infrastructure/database/orm/model/UserOrm'
import { deleteAllUserMock, insertUserMock } from './InsertUserMock'
import { Role } from '@/domain/model/user/AuthenticationData'
import { ComicOrm } from '@/infrastructure/database/orm/model/ComicOrm'
import { StatusUser } from '@/domain/model/user/StatusUser'

const connectionDatabase = new ConnectionDatabaseFactory().makeConnectionFactory()

const defaultParamData = {
  name: 'Any Name',
  email: 'valid@email.com',
  status: StatusUser.CREATED,
  password: 'EncryptedPassword',
  profileImage: 'path-image'
}

const defaultComicData = {
  title: "Any Title",
  published: "2020-10-10",
  writer: "Any Writer",
  penciler: "Any Penciler",
  coverArtist: "Any Cover Artist",
  description: "Any Description",
  edition: "5",
  coverImage: "http://server.com/images.png",
}


describe('UserDisfavorComicRouter', () => {
  let tokenAdmin: string
  let userId: string

  beforeEach(async () => {
    await connectionDatabase.open()

    const { id, token } = await insertUserMock(connectionDatabase, {
      name: 'Any Name',
      email: 'any@valid.com',
      password: 'Password@Valid',
      role: Role.ADMIN
    })

    userId = id
    tokenAdmin = token.value
  })

  afterAll(async () => {
    if (connectionDatabase.connection()) {
      await connectionDatabase.connection().
        createQueryBuilder().delete().
        from(ComicOrm).execute()

      await deleteAllUserMock(connectionDatabase)
    }

    await connectionDatabase.close()
  })


  test('should return 401 when not have token', async () => {
    await request(app).delete('/api/account/comics').
      send({ comicId: '' }).expect(401)
  })

  test('should return 200 when disfavor with success', async () => {

    const connection = connectionDatabase.connection()
    const comicRepository = connection.getRepository(ComicOrm)
    const userRepository = connection.getRepository(UserOrm)

    const comicSaved = await comicRepository.save(ComicOrm.create(defaultComicData as any).value as any)
    const userFound = await userRepository.findOne(userId)
    userFound.favoriteComics = [comicSaved]
    await userRepository.save(userFound)

    await request(app).delete('/api/account/comics').
      set({ 'Authorization': `Bearer ${tokenAdmin}` }).
      send({ comicId: comicSaved.id }).expect(200)

    const userWithoutFavoriteComics = await userRepository.findOne(userId)
    expect(userWithoutFavoriteComics.favoriteComics).toBeFalsy()
  })

  test('should return 200 when trying to remove an already removed comic ', async () => {
    await request(app).delete('/api/account/comics').
      set({ 'Authorization': `Bearer ${tokenAdmin}` }).
      send({ comicId: 'valid-id'}).expect(200)
  })

  test('should return 400 when not send comic id ', async () => {
    await request(app).delete('/api/account/comics').
      set({ 'Authorization': `Bearer ${tokenAdmin}` }).expect(400)
  })

})