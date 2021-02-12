export class RepositoryInternalError extends Error {
  constructor (public readonly cause: Error) {
    super(cause.message)
  }
}
