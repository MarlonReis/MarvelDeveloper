import { EnvironmentConfiguration } from '@/infrastructure/util/EnvironmentConfiguration'
import mockedEnv from 'mocked-env'

describe('EnvironmentConfiguration', () => {
  test('should return database configuration', () => {

    const response = EnvironmentConfiguration.database()
    expect(response).toHaveProperty('host')
    expect(response).toHaveProperty('port')
    expect(response).toHaveProperty('username')
    expect(response).toHaveProperty('password')
  })

  test('should ensure return same environment variable', async () => {
    let restore = mockedEnv({
      DB_HOST: 'Any Host',
      DB_PORT: undefined,
      DB_USERNAME: 'Any Name',
      DB_PASSWORD: 'Any Password'
    })

    const response = EnvironmentConfiguration.database()
    restore()

    expect(response).toMatchObject({
      host: 'Any Host',
      port: 3306,
      username: 'Any Name',
      password: 'Any Password'
    })

  })

  test('should return port when test', async () => {
    let restore = mockedEnv({
      APP_PORT: "446"
    })
    const response = EnvironmentConfiguration.appPort()
    restore()

    expect(response).toBe(446)
  })

  test('should return secret key', async () => {
    let restore = mockedEnv({
      AUTHENTICATION_SECRET_KEY: "OnlyKey"
    })
    const response = EnvironmentConfiguration.authenticationSecretKey()
    restore()

    expect(response).toBe("OnlyKey")
  })


})
