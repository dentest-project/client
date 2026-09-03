import { callKetalMethod } from '../jsonRpc'
import type { CallKetalMethodOptions } from '../jsonRpc'

export interface UpdateMyPersonalInformationParams {
  username: string
  email: string
  password?: string | null
}

export interface UpdateMyPersonalInformationOptions extends CallKetalMethodOptions {
  authorization: string
}

export interface UpdateMyPersonalInformationResult {
  id: string
  username: string
  email: string
}

export enum UpdateMyPersonalInformationErrorCode {
  AccessDenied = -32001,
  UserAlreadyExists = 20001,
  GatewayError = 20002,
  PasswordEncoderError = 20003,
  UnexpectedError = 20009,
}

const method = 'UpdateMyPersonalInformation'

export const updateMyPersonalInformation = async (
  params: UpdateMyPersonalInformationParams,
  options: UpdateMyPersonalInformationOptions,
): Promise<UpdateMyPersonalInformationResult> =>
  callKetalMethod<
    UpdateMyPersonalInformationParams,
    UpdateMyPersonalInformationResult
  >(method, params, options)
