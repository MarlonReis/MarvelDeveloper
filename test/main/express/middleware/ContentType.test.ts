
import request from 'supertest'
import app from '@/main/express/config/App'

describe('Content type Middleware', () => {
    test('should be default return content-type as json', async () => {
        app.get('/test-content-type', (req, res) => res.send({}))

      await request(app)
        .get('/test-content-type')
        .expect('content-type', /json/)
    })

    test('should be return xml content-type when force', async () => {
        app.get('/test-content-type-xml', (req, res) => {
            res.type('xml')
            res.send({})
        })
        await request(app)
        .get('/test-content-type-xml')
        .expect('content-type', /xml/)
    })
})
