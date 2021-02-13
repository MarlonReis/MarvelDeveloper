import { cors, bodyParser, contentType } from '@/main/express/middleware'

import { Express } from 'express'

export default (app: Express): void => {
    app.use(bodyParser)
    app.use(cors)
    app.use(contentType)
}
