import { EnvironmentConfiguration } from '@/infrastructure/util/EnvironmentConfiguration'

import dotenv from 'dotenv'

describe('EnvironmentConfiguration', () => {
  test('should return database configuration', () => {
    const response = EnvironmentConfiguration.database()

    expect(response).toHaveProperty('host')
    expect(response).toHaveProperty('port')
    expect(response).toHaveProperty('username')
    expect(response).toHaveProperty('password')
  })

  test('should ensure return same environment variable', () => {
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

  test('should return undefined when not have variable', () => {
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
})
