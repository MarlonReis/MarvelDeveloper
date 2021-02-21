export class UnauthorizedAccessError extends Error {
  constructor (role: string) {
    super(`Unauthorized access for ${role} users!`)
  }
}
