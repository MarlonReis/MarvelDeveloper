
import request from 'supertest'
import app from '@/main/express/config/App'

describe('CORS Middleware', () => {
  test('should be enable CORS', async () => {
    app.get('/test-cors', (req, res) => res.send())

    await request(app).get('/test-cors')
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Method', '*')
      .expect('Access-Control-Allow-Headers', '*')
  })
})
