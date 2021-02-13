export class InternalServerError extends Error {
  constructor (public readonly cause: Error) {
    super('Internal server error')
    this.name = 'InternalServerError'
  }
}
