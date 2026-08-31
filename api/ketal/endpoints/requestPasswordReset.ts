import { callKetalMethod } from '../jsonRpc'
import { isKetalJsonRpcError } from '../errors'
import type { KetalJsonRpcError } from '../errors'

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

export interface RequestPasswordResetTooEarlyError extends KetalJsonRpcError {
  code: RequestPasswordResetErrorCode.ResetPasswordRequestTooEarly
  data: RequestPasswordResetTooEarlyErrorData
}

export const isRequestPasswordResetTooEarlyError = (
  error: unknown,
): error is RequestPasswordResetTooEarlyError =>
  isKetalJsonRpcError(error) &&
  error.code === RequestPasswordResetErrorCode.ResetPasswordRequestTooEarly

const method = 'RequestPasswordReset'

export const requestPasswordReset = async (
  params: RequestPasswordResetParams,
): Promise<RequestPasswordResetResult> =>
  callKetalMethod<RequestPasswordResetParams, RequestPasswordResetResult>(
    method,
    params,
  )
