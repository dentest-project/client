import { callKetalMethod } from '../jsonRpc'
import type { CallKetalMethodOptions } from '../jsonRpc'

export type ListMyOrganizationsParams = undefined

export interface ListMyOrganizationsOptions extends CallKetalMethodOptions {
  authorization: string
}

export type ListMyOrganizationsResult = Array<{
  id: string
  name: string
  slug: string
}>

export enum ListMyOrganizationsErrorCode {
  AccessDenied = -32001,
  GatewayError = 20002,
  UnexpectedError = 20009,
}

const method = 'ListMyOrganizations'

export const listMyOrganizations = async (
  options: ListMyOrganizationsOptions,
): Promise<ListMyOrganizationsResult> =>
  callKetalMethod<ListMyOrganizationsParams, ListMyOrganizationsResult>(
    method,
    undefined,
    options,
  )
