import jwt from 'jsonwebtoken'

import { JwtAdapter } from '@/infrastructure/adapter'

describe('JwtAdapter', () => {
  test('should call sign with correct values ', async () => {
    const signSpy = jest.spyOn(jwt, 'sign')

    const sut = new JwtAdapter('secret_key')
    await sut.execute("any_value")

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value'},'secret_key')
  })
})