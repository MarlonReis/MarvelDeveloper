import { BadRequestError, InternalServerError } from '@/presentation/error'
import { HttpResponse } from '@/presentation/protocols/Http'

export const createSuccess = (): HttpResponse => ({
    statusCode: 201
})

export const ok = (body?: any): HttpResponse => ({
    statusCode: 200,
    body
})

export const customError = (code: number, body?: any): HttpResponse => ({
    statusCode: code,
    body
})

export const badRequest = (message: string): HttpResponse => ({
    statusCode: 400,
    body: new BadRequestError(message)
})

export const unProcessableEntity = (error: Error): HttpResponse => ({
    statusCode: 422,
    body: error
})

export const internalServerError = (causeError: Error): HttpResponse => ({
    statusCode: 500,
    body: new InternalServerError(causeError)
})
