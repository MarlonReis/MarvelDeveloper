export interface HttpResponse {
  statusCode: number
  body?: any
}

export interface HttpRequest {
  authentication?: any
  body?: any
  params?: any
  query?: any
  headers?: any
}
