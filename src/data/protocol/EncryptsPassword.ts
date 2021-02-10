export interface EncryptsPassword {
  execute: (data: string) => Promise<string>
}
