export class DatabaseConnectionError extends Error {
  constructor (private readonly cause: Error, message: string) {
    super(message)
  }
}
