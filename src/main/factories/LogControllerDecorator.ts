import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly controllerName: string

  constructor (name: string, controller: Controller) {
    this.controller = controller
    this.controllerName = name
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
      console.log(this.controllerName, responseDataError)
    }
    return response
  }
}
