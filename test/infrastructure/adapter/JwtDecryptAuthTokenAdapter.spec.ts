import jwt from 'jsonwebtoken'

import {
  JwtDecryptAuthTokenAdapter
} from '@/infrastructure/adapter/JwtDecryptAuthTokenAdapter'
import { DecryptError } from '@/data/error'

jest.mock('jsonwebtoken', () => ({
  async decode(): Promise<any> {
    return {
      payload: {
        id: 'valid_id'
      }

    }
  }
}))

describe('JwtDecryptAuthTokenAdapter', () => {
  test('should call jwt decode with correct values', async () => {
    const decodeSpy = jest.spyOn(jwt, 'decode')

    const sut = new JwtDecryptAuthTokenAdapter()
    await sut.execute("valid_token")
    expect(decodeSpy).toHaveBeenCalledWith("valid_token", expect.anything())
  })

  test('should failure when not have id in payload', async () => {
    const sut = new JwtDecryptAuthTokenAdapter()
    const response = await sut.execute("valid_token")

    expect(response.value).toEqual("valid_id")
  })

  test('should return failure when decode return undefined', async () => {
    jest.spyOn(jwt, 'decode').mockImplementationOnce(() => undefined)

    const sut = new JwtDecryptAuthTokenAdapter()
    const response = await sut.execute("valid_token")

    expect(response.value).toEqual(new DecryptError('Unable to decrypt token'))
  })

  test('should return failure when data return undefined', async () => {
    jest.spyOn(jwt, 'decode').mockImplementationOnce(() => ({}))

    const sut = new JwtDecryptAuthTokenAdapter()
    const response = await sut.execute("valid_token")

    expect(response.value).toEqual(new DecryptError('Unable to decrypt token'))
  })


  test('should return failure when payload return empty', async () => {
    jest.spyOn(jwt, 'decode').mockImplementationOnce(() => ({ payload: {} }))

    const sut = new JwtDecryptAuthTokenAdapter()
    const response = await sut.execute("valid_token")

    expect(response.value).toEqual(new DecryptError('Unable to decrypt token'))
  })


  test('should return failure when decode throws error', async () => {
    jest.spyOn(jwt, 'decode').mockImplementationOnce(() => {
      throw new Error('Error message')
    })

    const sut = new JwtDecryptAuthTokenAdapter()
    const response = await sut.execute("valid_token")

    expect(response.value).toEqual(new DecryptError('Error message'))
  })

})