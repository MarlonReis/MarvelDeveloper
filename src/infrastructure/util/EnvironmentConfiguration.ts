import { ConfigConnection } from '@/infrastructure/database/protocol/ConnectionDatabase'

export const EnvironmentConfiguration = {
  database (): ConfigConnection {
    const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } = process.env
    const config = {
      host: DB_HOST,
      port: parseInt(DB_PORT || '3306'),
      username: DB_USERNAME,
      password: DB_PASSWORD
    }
    return config
  },

  authenticationSecretKey (): string {
    const { AUTHENTICATION_SECRET_KEY } = process.env
    return AUTHENTICATION_SECRET_KEY
  },

  appPort (): number {
    const { APP_PORT } = process.env
    return parseInt(APP_PORT)
  }

}
