export interface LoggerSystem {
  info: (fileOrigin: string, message: string) => void
  error: (fileOrigin: string, error: Error) => void
  warn: (fileOrigin: string, message: string) => void
}
