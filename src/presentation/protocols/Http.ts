export interface HttpResponse {
  statusCode: number
  body?: any
}

export interface HttpRequest {
  authenticatedUserData?: any
  body?: any
  params?: any
  query?: any
  headers?: any
}
