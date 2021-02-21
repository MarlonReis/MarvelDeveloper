import { EnvironmentConfiguration } from '@/infrastructure/util/EnvironmentConfiguration'
import { JwtTokenGeneratorAdapter } from '@/infrastructure/adapter'
import { TokenGenerator } from '@/data/protocol/TokenGenerator'

export class TokenGeneratorFactory {
  makeTokenGenerator (): TokenGenerator {
    const secretKey = EnvironmentConfiguration.authenticationSecretKey()
    return new JwtTokenGeneratorAdapter(secretKey)
  }
}
