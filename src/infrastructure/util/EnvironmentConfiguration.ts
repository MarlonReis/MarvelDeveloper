import * as dotenv from 'dotenv'

import { ConfigConnection } from '@/infrastructure/database/protocol/ConnectionDatabase'

export const EnvironmentConfiguration = {
  database (): ConfigConnection {
    const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } = dotenv.config().parsed
    return ({
      host: DB_HOST,
      port: parseInt(DB_PORT || '3306'),
      username: DB_USERNAME,
      password: DB_PASSWORD
    })
  }

}
