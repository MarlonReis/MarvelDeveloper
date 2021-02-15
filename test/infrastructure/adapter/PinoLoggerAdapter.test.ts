import { PinoLoggerAdapter } from "@/infrastructure/adapter/PinoLoggerAdapter"

describe('PinoLoggerAdapter', () => {

  test('should call child with origin when call info', () => {
    const sut = new PinoLoggerAdapter()

    const childSpy = jest.spyOn((sut as any).logger, 'child')

    sut.info('Origin info', 'Any Message')
    sut.warn('Origin warn', 'Any Message')
    sut.error('Origin error', new Error('Any Message'))

    expect(childSpy).toBeCalledWith({ filename: 'Origin info' })
    expect(childSpy).toBeCalledWith({ filename: 'Origin warn' })
    expect(childSpy).toBeCalledWith({ filename: 'Origin error' })
    expect(childSpy).toBeCalledTimes(3)
  })

})