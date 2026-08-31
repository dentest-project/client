import { callKetalMethod } from '../jsonRpc'

export interface ResetPasswordParams {
  code: string
  password: string
}

export interface ResetPasswordResult {
  id: string
  username: string
  email: string
}

export enum ResetPasswordErrorCode {
  GatewayError = 20002,
  PasswordEncoderError = 20003,
  UserNotFound = 20007,
}

const method = 'ResetPassword'

export const resetPassword = async (
  params: ResetPasswordParams,
): Promise<ResetPasswordResult> =>
  callKetalMethod<ResetPasswordParams, ResetPasswordResult>(method, params)
