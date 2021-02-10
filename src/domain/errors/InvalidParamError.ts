export class InvalidParamError extends Error {
    constructor (param: string, value: string) {
        super(`Attribute '${param}' equals '${value}' is invalid!`)
    }
}
