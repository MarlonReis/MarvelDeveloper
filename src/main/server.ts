import 'module-alias/register'

import { EnvironmentConfiguration } from '@/infrastructure/util/EnvironmentConfiguration'
import { ConnectionDatabaseFactory } from './factories/ConnectionDatabaseFactory'
import app from '@/main/express/config/App'

const appPort = EnvironmentConfiguration.appPort()

const connection = new ConnectionDatabaseFactory().makeConnectionFactory()
connection.open().then(() => {
  app.listen(appPort, () => console.log(`🚀 Server running at http://localhost:${appPort}`))
})
