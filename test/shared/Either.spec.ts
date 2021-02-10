import { success, failure } from '@/shared/Either'

describe('Either', () => {
    test('should return object when call success function', () => {
        const response = success({ data: 'valid value' })

        expect(response.isSuccess()).toBe(true)
        expect(response.isFailure()).toBe(false)
        expect(response.value).toBeInstanceOf(Object)
        expect(response.value).toMatchObject({
            data: 'valid value'
        })
    })

    test('should return error when call failure function', () => {
        const response = failure(new Error('message error'))

        expect(response.isSuccess()).toBe(false)
        expect(response.isFailure()).toBe(true)
        expect(response.value).toBeInstanceOf(Error)
        expect(response.value).toMatchObject({
            message: 'message error'
        })
    })
})
