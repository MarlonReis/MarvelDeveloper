
import request from 'supertest'
import app from '@/main/express/config/App'

const requestData = { name: 'Any Name', data: 'Any Data', info: 'Any info' }

describe('Body Parser Middleware', () => {
    test('should be parse body as json', async () => {
      app.post('/test-body-parse',
        (req, res) => res.status(201)
          .send(req.body))

      await request(app)
        .post('/test-body-parse')
        .send(requestData).expect(201, requestData)
    })
})
