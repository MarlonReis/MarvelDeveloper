import * as dotenv from 'dotenv'

import { ConfigConnection } from '@/infrastructure/database/protocol/ConnectionDatabase'

enum Environment {
  LOCAL = 'local',
  TEST = 'test'
}

const getDatabaseLocal = (): ConfigConnection => {
  const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } = dotenv.config().parsed
  return ({
    host: DB_HOST,
    port: parseInt(DB_PORT || '3306'),
    username: DB_USERNAME,
    password: DB_PASSWORD
  })
}

const getDatabaseTest = (): ConfigConnection => {
  const { TEST_DB_HOST, TEST_DB_PORT, TEST_DB_USERNAME, TEST_DB_PASSWORD } = dotenv.config().parsed
  return ({
    host: TEST_DB_HOST,
    port: parseInt(TEST_DB_PORT || '3306'),
    username: TEST_DB_USERNAME,
    password: TEST_DB_PASSWORD
  })
}

const EnvironmentConfiguration = {
  environment (): Environment {
      if (process.env.NODE_ENV.trim() === Environment.LOCAL) {
      return Environment.LOCAL
    }
    return Environment.TEST
  },

  database (): ConfigConnection {
    if (EnvironmentConfiguration.environment() === Environment.LOCAL) {
      return getDatabaseLocal()
    }
    return getDatabaseTest()
  },

  authenticationSecretKey (): string {
    const { AUTHENTICATION_SECRET_KEY } = dotenv.config().parsed
    return AUTHENTICATION_SECRET_KEY
  },

  appPort (): number {
    const { APP_PORT, TEST_APP_PORT } = dotenv.config().parsed
    if (EnvironmentConfiguration.environment() === Environment.TEST) {
      return parseInt(TEST_APP_PORT)
    }
    return parseInt(APP_PORT)
  }

}

export { EnvironmentConfiguration, Environment }
