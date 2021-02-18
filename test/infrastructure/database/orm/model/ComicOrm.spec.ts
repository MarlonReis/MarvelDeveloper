import { InvalidParamError } from "@/domain/errors"
import { ComicOrm } from "@/infrastructure/database/orm/model/ComicOrm"

const defaultComicData = {
  title: 'Any Title',
  published: '2021-01-10',
  writer: 'Any Valid',
  penciler: 'Any Valid',
  coverArtist: 'Any Valid',
  description: 'Any description',
  edition: '4',
  coverImage: 'http://any-servidor.com/img.png',
  characters: []
}

describe('ComicOrm', () => {

  test('should return success when received correct params', () => {
    const response = ComicOrm.create(defaultComicData)

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toMatchObject({
      ...defaultComicData,
      edition: 4,
      published: new Date('2021-01-10')
    })     
  })

  test('should return failure when title is invalid', () => {
    const response = ComicOrm.create({ ...defaultComicData, title: 'an' })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new InvalidParamError('title', 'an'))
    expect(response.value).toMatchObject({
      message: "Attribute 'title' equals 'an' is invalid!"
    })
  })

  
})