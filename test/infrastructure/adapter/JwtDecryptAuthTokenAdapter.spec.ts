import jwt from 'jsonwebtoken'

import {
  JwtDecryptAuthTokenAdapter
} from '@/infrastructure/adapter/JwtDecryptAuthTokenAdapter'
import { DecryptError } from '@/data/error'

jest.mock('jsonwebtoken', () => ({
  async verify(): Promise<any> {
    return { id: 'valid_id' }
  }
}))

const makeSutFactory = (): JwtDecryptAuthTokenAdapter => new JwtDecryptAuthTokenAdapter("SecretKey")

describe('JwtDecryptAuthTokenAdapter', () => {
  test('should call jwt decode with correct values', async () => {
    const decodeSpy = jest.spyOn(jwt, 'verify')

    const sut = makeSutFactory()
    await sut.execute("valid_token")
    expect(decodeSpy).toHaveBeenCalledWith("valid_token", "SecretKey")
  })

  test('should failure when not have id in payload', async () => {
    const sut = makeSutFactory()
    const response = await sut.execute("valid_token")

    expect(response.value).toEqual("valid_id")
  })


  test('should return failure when decode throws error', async () => {
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error('Error message')
    })

    const sut = makeSutFactory()
    const response = await sut.execute("valid_token")

    expect(response.value).toEqual(new DecryptError('Error message'))
  })

})