import { callKetalMethod } from '../jsonRpc'

export interface RegisterParams {
  username: string,
  email: string,
  password: string
}

export interface RegisterResult {
  id: string,
  username: string,
  email: string
}

export enum RegisterErrorCode {
  UserAlreadyExists = 20001,
  GatewayError = 20002,
  PasswordEncoderError = 20003
}

const method = 'Register'

export const register = async (params: RegisterParams): Promise<RegisterResult> =>
  callKetalMethod<RegisterParams, RegisterResult>(method, params)
