export class DifferentPasswordError extends Error {
  constructor () {
    super('Password are different')
  }
}
