
export class MissingParamError extends Error {
  constructor (paramName: string) {
      super(`Attribute '${paramName}' is invalid!`)
  }
}
