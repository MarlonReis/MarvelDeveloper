import { forbidden } from "@/presentation/helper"
import { AuthMiddleware } from "@/presentation/middleware/AuthMiddleware"

describe('AuthMiddleware', () => {
  test('should return 403 when x-access-token not exist in headers', async () => {
    const sut = new AuthMiddleware()
    const response = await sut.handle({ headers: { 'x-access-token': 'invalid-token' } })
    
    expect(response).toEqual(forbidden())
  })
})