import 'module-alias/register'

import { EnvironmentConfiguration } from '@/infrastructure/util/EnvironmentConfiguration'
import { ConnectionDatabaseFactory } from './factories/ConnectionDatabaseFactory'
import app from '@/main/express/config/App'
import { PinoLoggerAdapter } from '@/infrastructure/adapter'

(async () => {
  const logger = new PinoLoggerAdapter()

  const appPort = EnvironmentConfiguration.appPort()
  const connection = new ConnectionDatabaseFactory().makeConnectionFactory()
  const response = await connection.open()
  if (response.isSuccess()) {
    app.listen(appPort, () => logger.info('server', `🚀 Server running at http://localhost:${appPort}`))
  } else {
    logger.error('server', response.value)
    process.exit(1)
  }
})()
