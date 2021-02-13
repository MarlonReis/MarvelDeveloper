import { InternalServerError } from '@/presentation/error'
import { HttpResponse } from '@/presentation/protocols/Http'

export const createSuccess = (): HttpResponse => ({
    statusCode: 201
})

// export const ok = (body?: any): HttpResponse => ({
//     statusCode: 200,
//     body
// })

export const unProcessableEntity = (error: Error): HttpResponse => ({
    statusCode: 422,
    body: error
})

export const internalServerError = (causeError: Error): HttpResponse => ({
    statusCode: 500,
    body: new InternalServerError(causeError)
})
