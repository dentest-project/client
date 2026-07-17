import { callKetalMethod } from '../jsonRpc'

export interface RequestPasswordResetParams {
  subject: string
}

export type RequestPasswordResetResult = null

export interface RequestPasswordResetTooEarlyErrorData {
  remainingMinutes: number
}

export enum RequestPasswordResetErrorCode {
  GatewayError = 20002,
  UserNotFound = 20007,
  ResetPasswordRequestTooEarly = 20008,
}

const method = 'RequestPasswordReset'

export const requestPasswordReset = async (
  params: RequestPasswordResetParams,
): Promise<RequestPasswordResetResult> =>
  callKetalMethod<RequestPasswordResetParams, RequestPasswordResetResult>(
    method,
    params,
  )
