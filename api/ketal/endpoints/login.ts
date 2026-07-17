import { callKetalMethod } from '../jsonRpc'

export interface LoginParams {
  subject: string,
  password: string
}

export interface LoginResult {
  token: string
}

export enum LoginErrorCode {
  GatewayError = 20002,
  InvalidCredentials = 20004,
  TokenGeneratorError = 20005,
  PasswordDecoderError = 20006
}

const method = 'Login'

export const login = async (params: LoginParams): Promise<LoginResult> =>
  callKetalMethod<LoginParams, LoginResult>(method, params)
