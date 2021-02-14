import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"
import { ExpressControllerAdapter } from "@/main/express/adapter/ExpressControllerAdapter"

import { Request, Response } from 'express'

const MockResponse = {
  status(code: any): Response {
    return this
  },
  json(code: any): Response {
    return this
  }
} as Response

const controllerStubFactory = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve({ statusCode: 200, body: { anyProp: 'ok' } })
    }
  }
  return new ControllerStub()
}

describe('ExpressControllerAdapter', () => {
  test('should receive correct body', async () => {

    const controllerStub = controllerStubFactory()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await ExpressControllerAdapter(controllerStub)({ body: { anyProp: 'other' } } as Request, MockResponse)
    expect(handleSpy).toBeCalledWith({ body: { anyProp: 'other' }, params: undefined })

  })

  test('should receive correct param', async () => {
    const controllerStub = controllerStubFactory()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await ExpressControllerAdapter(controllerStub)({ params: {} } as Request, MockResponse)
    expect(handleSpy).toBeCalledWith({ body: undefined, params: {} })
  })

  test('should pass with parameter the controller response when response is 200', async () => {
    const controllerStub = controllerStubFactory()
    const statusSpy = jest.spyOn(MockResponse, 'status')
    const jsonSpy = jest.spyOn(MockResponse, 'json')

    await ExpressControllerAdapter(controllerStub)({} as Request, MockResponse)

    expect(statusSpy).toBeCalledWith(200)
    expect(jsonSpy).toBeCalledWith({ anyProp: 'ok' })
  })

  test('should pass with parameter the controller response when response is 201', async () => {
    const controllerStub = controllerStubFactory()
    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(() => Promise.
      resolve({ statusCode: 201, body: { anyProp: 'ok' } }))

    const statusSpy = jest.spyOn(MockResponse, 'status')
    const jsonSpy = jest.spyOn(MockResponse, 'json')

    await ExpressControllerAdapter(controllerStub)({} as Request, MockResponse)

    expect(statusSpy).toBeCalledWith(201)
    expect(jsonSpy).toBeCalledWith({ anyProp: 'ok' })
  })

  test('should pass with parameter the controller response when response is 500', async () => {
    const controllerStub = controllerStubFactory()
    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(() => Promise.
      resolve({ statusCode: 500, body: new Error("Any message") }))

    const statusSpy = jest.spyOn(MockResponse, 'status')
    const jsonSpy = jest.spyOn(MockResponse, 'json')

    await ExpressControllerAdapter(controllerStub)({} as Request, MockResponse)

    expect(statusSpy).toBeCalledWith(500)
    expect(jsonSpy).toBeCalledWith({ error: 'Error', message: "Any message" })
  })

})