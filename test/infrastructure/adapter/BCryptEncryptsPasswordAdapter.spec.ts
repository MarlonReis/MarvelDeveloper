import bcrypt from 'bcrypt'
import { InvalidPasswordParameterError } from '@/data/error'
import { EncryptsPassword } from '@/data/protocol/EncryptsPassword'
import { BCryptEncryptsPasswordAdapter } from '@/infrastructure/adapter/BCryptEncryptsPasswordAdapter'

describe('BCryptEncryptsPasswordAdapter', () => {
  let encrypt: EncryptsPassword

  beforeAll(() => {
    encrypt = new BCryptEncryptsPasswordAdapter(12)
  })

  test('should encrypt password is valid', async () => {
    const password = 'P4ssW0rd@Valid'
    const passwordEncrypted = await encrypt.execute(password)

    expect(passwordEncrypted.value).toBeTruthy()
    expect(passwordEncrypted.isSuccess()).toBe(true)
  })

  test('should return error when received parameter undefined', async () => {
    const passwordEncrypted = await encrypt.execute(undefined)

    expect(passwordEncrypted.value).toBeInstanceOf(InvalidPasswordParameterError)
    expect(passwordEncrypted.isFailure()).toBe(true)
  })

  test('should return failure when bcrypt throws error', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error('Any error')
    })

    const password = 'P4ssW0rd@Valid'
    const passwordEncrypted = await encrypt.execute(password)
    expect(passwordEncrypted.isFailure()).toBe(true)
    expect(passwordEncrypted.value).toMatchObject({
      message: 'Any error'
    })
  })
})
