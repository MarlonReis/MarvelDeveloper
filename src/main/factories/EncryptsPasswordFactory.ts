import { EncryptsPassword } from '@/data/protocol/EncryptsPassword'
import { BCryptEncryptsPasswordAdapter } from '@/infrastructure/adapter'

export class EncryptsPasswordFactory {
  makeFactory (): EncryptsPassword {
    const salt = 12
    return new BCryptEncryptsPasswordAdapter(salt)
  }
}
