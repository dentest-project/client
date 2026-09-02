import { callKetalMethod } from '../jsonRpc'
import type { CallKetalMethodOptions } from '../jsonRpc'

export type WhoAmIParams = undefined

export interface WhoAmIOptions extends CallKetalMethodOptions {
  authorization: string
}

export interface WhoAmIResult {
  id: string
  username: string
  email: string
}

export enum WhoAmIErrorCode {
  AccessDenied = -32001,
  UnexpectedError = 20009,
}

const method = 'WhoAmI'

export const whoAmI = async (options: WhoAmIOptions): Promise<WhoAmIResult> =>
  callKetalMethod<WhoAmIParams, WhoAmIResult>(method, undefined, options)
