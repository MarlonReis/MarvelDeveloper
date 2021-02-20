import jwt from 'jsonwebtoken'

import { JwtAdapter } from '@/infrastructure/adapter'
import { TokenGeneratorError } from '@/data/error/TokenGeneratorError'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return "valid_token"
  }
}))

const makeSutFactory = (): JwtAdapter => new JwtAdapter('secret_key')


describe('JwtAdapter', () => {
  test('should call sign with correct values ', async () => {
    const signSpy = jest.spyOn(jwt, 'sign')

    const sut = makeSutFactory()
    await sut.execute("any_value")

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret_key')
  })

  test('should return toke with success', async () => {
    const sut = makeSutFactory()
    const response = await sut.execute("any_value")

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toEqual('valid_token')
  })

  test('should failure when jwt throws error', async () => {
    jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => {
      throw new Error('Any Message')
    })

    const sut = makeSutFactory()
    const response = await sut.execute("any_value")

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new TokenGeneratorError())
  })


})