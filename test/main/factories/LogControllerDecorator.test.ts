import { LoggerSystem } from '@/infrastructure/util/LoggerSystem'
import { LogControllerDecorator } from '@/main/factories/LogControllerDecorator'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

const defaultDataResponse = { statusCode: 200, body: { anyProperty: 'ok' } }

const loggerSystemStubFactory = (): LoggerSystem => {
  class LoggerSystemStub implements LoggerSystem {
    info (fileOrigin: string, message: string): void { }
    error (fileOrigin: string, error: Error): void { }
    warn (fileOrigin: string, message: string): void { }
  }
  return new LoggerSystemStub()
}

const controllerStubFactory = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(defaultDataResponse)
    }
  }
  return new ControllerStub()
}

interface TypeSut {
  controllerStub: Controller
  loggerSystemStub: LoggerSystem
  sut: LogControllerDecorator
}

const makeSutFactory = (): TypeSut => {
  const controllerStub = controllerStubFactory()
  const loggerSystemStub = loggerSystemStubFactory()
  const sut = new LogControllerDecorator(loggerSystemStub, controllerStub)

  return { controllerStub, loggerSystemStub, sut }
}

describe('LogControllerDecorator', () => {
  test('should not execute logger when statusCode is 200', async () => {
    const { sut, loggerSystemStub } = makeSutFactory()

    const infoSpy = jest.spyOn(loggerSystemStub, 'info')

    const response = await sut.handle({})

    expect(response).toEqual(defaultDataResponse)
    expect(infoSpy).toBeCalledTimes(0)
  })

  test('should not execute logger when statusCode is 201', async () => {
    const { sut, loggerSystemStub, controllerStub } = makeSutFactory()

    jest.spyOn(controllerStub, 'handle')
      .mockImplementationOnce(async () => await Promise.resolve({ statusCode: 201 }))

    const infoSpy = jest.spyOn(loggerSystemStub, 'info')
    const errorSpy = jest.spyOn(loggerSystemStub, 'error')
    const warnSpy = jest.spyOn(loggerSystemStub, 'warn')

    const response = await sut.handle({})
    expect(response.statusCode).toBe(201)

    expect(infoSpy).toBeCalledTimes(0)
    expect(errorSpy).toBeCalledTimes(0)
    expect(warnSpy).toBeCalledTimes(0)
  })

  test('should execute logger when statusCode is not 200 or 201', async () => {
    const { sut, loggerSystemStub, controllerStub } = makeSutFactory()
    const responseError = new Error('Any message')

    jest.spyOn(controllerStub, 'handle')
      .mockImplementationOnce(async () => await Promise.resolve({
        statusCode: 404,
        body: responseError
      }))

    const infoSpy = jest.spyOn(loggerSystemStub, 'info')
    const response = await sut.handle({})

    expect(response).toMatchObject({
      statusCode: 404,
      body: responseError
    })

    const logParamError = {
      status: 404,
      body: {
        name: 'Error',
        message: 'Any message',
        cause: undefined,
        stack: responseError.stack
      }
    }

    expect(infoSpy).toBeCalledWith('LogControllerDecorator', JSON.stringify(logParamError))
  })

  test('should call info when statusCode is not 200 or 201', async () => {
    const { sut, loggerSystemStub, controllerStub } = makeSutFactory()

    jest.spyOn(controllerStub, 'handle')
      .mockImplementationOnce(async () => await Promise.resolve({
        statusCode: 404,
        body: new Error('Any message')
      }))

    const infoSpy = jest.spyOn(loggerSystemStub, 'info')
    const errorSpy = jest.spyOn(loggerSystemStub, 'error')
    const warnSpy = jest.spyOn(loggerSystemStub, 'warn')

    await sut.handle({})
    expect(infoSpy).toBeCalledTimes(1)
    expect(errorSpy).toBeCalledTimes(0)
    expect(warnSpy).toBeCalledTimes(0)
  })
})
