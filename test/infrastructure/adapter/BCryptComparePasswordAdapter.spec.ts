import bcrypt from 'bcrypt'
import { BCryptComparePasswordAdapter } from '@/infrastructure/adapter/BCryptComparePasswordAdapter'
import { DifferentPasswordError, InvalidPasswordParameterError } from '@/data/error'

jest.mock('bcrypt', () => ({
  async compare(): Promise<boolean> {
    return true
  }
}))



const makeSutFactory = (): BCryptComparePasswordAdapter => new BCryptComparePasswordAdapter()

describe('BCryptComparePasswordAdapter', () => {
  test('should call bcrypt compare with correct password', async () => {
    const compareSpy = jest.spyOn(bcrypt, 'compare')

    const sut = makeSutFactory()
    await sut.execute('cleanPassword', 'encryptedPassword')

    expect(compareSpy).toHaveBeenCalledWith('cleanPassword', 'encryptedPassword')
  })

  test('should success when password equals', async () => {
    const sut = makeSutFactory()
    const response = await sut.execute('cleanPassword', 'encryptedPassword')

    expect(response.isSuccess()).toBe(true)
  })

  test('should failure when password is not equals', async () => {
    const sut = makeSutFactory()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => false)
    const response = await sut.execute('cleanPassword', 'encryptedPassword')

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new DifferentPasswordError())
  })

  test('should failure when bcrypt throws error', async () => {
    const sut = makeSutFactory()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
      throw new Error('Any message')
    })
    const response = await sut.execute('cleanPassword', 'encryptedPassword')

    expect(response.isFailure()).toBe(true)
    expect(response.value).toEqual(new InvalidPasswordParameterError('Any message'))
  })

})