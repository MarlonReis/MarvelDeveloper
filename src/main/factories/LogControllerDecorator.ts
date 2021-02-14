import { LoggerSystem } from '@/infrastructure/util/LoggerSystem'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logger: LoggerSystem

  constructor (logger: LoggerSystem, controller: Controller) {
    this.controller = controller
    this.logger = logger
  }

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const response = await this.controller.handle(httpRequest)

    if (response.statusCode !== 200 && response.statusCode !== 201) {
      const { message, stack, cause } = response.body
      const responseDataError = {
        status: response.statusCode,
        body: {
          name: response.body.constructor.name,
          message,
          cause,
          stack
        }
      }

      this.logger.info(this.constructor.name, JSON.stringify(responseDataError))
    }
    return response
  }
}
