export class DatabaseConnectionError extends Error {
  private readonly cause: Error
  constructor (cause: Error, message: string) {
    super(message)
    this.cause = cause
    Object.freeze(this)
  }
}
