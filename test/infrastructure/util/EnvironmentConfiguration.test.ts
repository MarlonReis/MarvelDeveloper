import { EnvironmentConfiguration, Environment } from '@/infrastructure/util/EnvironmentConfiguration'

import dotenv from 'dotenv'

describe('EnvironmentConfiguration', () => {
  test('should return database configuration', () => {
    jest.spyOn(EnvironmentConfiguration, 'environment')
      .mockReturnValueOnce(Environment.TEST)


    const response = EnvironmentConfiguration.database()
    expect(response).toHaveProperty('host')
    expect(response).toHaveProperty('port')
    expect(response).toHaveProperty('username')
    expect(response).toHaveProperty('password')
  })

  test('should return database configuration local', () => {
    jest.spyOn(EnvironmentConfiguration, 'environment')
      .mockReturnValueOnce(Environment.LOCAL)

    const response = EnvironmentConfiguration.database()
    expect(response).toHaveProperty('host')
    expect(response).toHaveProperty('port')
    expect(response).toHaveProperty('username')
    expect(response).toHaveProperty('password')
  })

  test('should ensure return same environment variable', () => {
    jest.spyOn(EnvironmentConfiguration, 'environment')
      .mockReturnValueOnce(Environment.LOCAL)

    jest.spyOn(dotenv, 'config').mockReturnValueOnce({
      parsed: {
        DB_HOST: 'Any Host',
        DB_PORT: '1007',
        DB_USERNAME: 'Any Name',
        DB_PASSWORD: 'Any Password'
      }
    })
    const response = EnvironmentConfiguration.database()
    expect(response).toMatchObject({
      host: 'Any Host',
      port: 1007,
      username: 'Any Name',
      password: 'Any Password'
    })
  })

  test('should ensure return same environment variable  when environment is test', () => {
    jest.spyOn(EnvironmentConfiguration, 'environment')
      .mockReturnValueOnce(Environment.TEST)

    jest.spyOn(dotenv, 'config').mockReturnValueOnce({
      parsed: {
        TEST_DB_HOST: 'Any Host',
        TEST_DB_PORT: '1007',
        TEST_DB_USERNAME: 'Any Name',
        TEST_DB_PASSWORD: 'Any Password'
      }
    })
    const response = EnvironmentConfiguration.database()
    expect(response).toMatchObject({
      host: 'Any Host',
      port: 1007,
      username: 'Any Name',
      password: 'Any Password'
    })
  })

  test('should return undefined when not have variable', () => {
    jest.spyOn(EnvironmentConfiguration, 'environment')
      .mockReturnValueOnce(Environment.LOCAL)

    jest.spyOn(dotenv, 'config').mockReturnValueOnce({
      parsed: {
        DB_USERNAME: 'Any Name',
        DB_PASSWORD: 'Any Password'
      }
    })

    const response = EnvironmentConfiguration.database()
    expect(response).toMatchObject({
      host: undefined,
      port: 3306,
      username: 'Any Name',
      password: 'Any Password'
    })
  })

  test('should return undefined when not have variable and environment is test', () => {
    jest.spyOn(EnvironmentConfiguration, 'environment')
      .mockReturnValueOnce(Environment.TEST)

    jest.spyOn(dotenv, 'config').mockReturnValueOnce({
      parsed: {
        TEST_DB_USERNAME: 'Any Name',
        TEST_DB_PASSWORD: 'Any Password',
        TEST_DB_HOST: undefined
      }
    })

    const response = EnvironmentConfiguration.database()
    expect(response).toMatchObject({
      host: undefined,
      port: 3306,
      username: 'Any Name',
      password: 'Any Password'
    })
  })

  test('should return port when test', () => {
    jest.spyOn(EnvironmentConfiguration, 'environment')
      .mockReturnValueOnce(Environment.TEST)

    jest.spyOn(dotenv, 'config').mockReturnValueOnce({
      parsed: {
        TEST_APP_PORT: "446"
      }
    })

    const response = EnvironmentConfiguration.appPort()
    expect(response).toBe(446)
  })

  test('should return port when local', () => {
    jest.spyOn(EnvironmentConfiguration, 'environment')
      .mockReturnValueOnce(Environment.LOCAL)

    jest.spyOn(dotenv, 'config').mockReturnValueOnce({
      parsed: {
        APP_PORT: "458"
      }
    })

    const response = EnvironmentConfiguration.appPort()
    expect(response).toBe(458)
  })

  test('should return TEST when process return test', () => {
    process.env.NODE_ENV = "test"
    const response = EnvironmentConfiguration.environment()
    expect(response).toEqual(Environment.TEST)
  })

  test('should return TEST when process return local', () => {
    process.env.NODE_ENV = "local"
    const response = EnvironmentConfiguration.environment()
    expect(response).toEqual(Environment.LOCAL)
  })

})
