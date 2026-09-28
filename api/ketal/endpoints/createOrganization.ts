import { callKetalMethod } from '../jsonRpc'
import type { CallKetalMethodOptions } from '../jsonRpc'

export interface CreateOrganizationParams {
  name: string
}

export interface CreateOrganizationOptions extends CallKetalMethodOptions {
  authorization: string
}

export interface CreateOrganizationResult {
  id: string
  name: string
  slug: string
}

export enum CreateOrganizationErrorCode {
  AccessDenied = -32001,
  OrganizationAlreadyExists = 20010,
  GatewayError = 20002,
  UnexpectedError = 20009,
}

const method = 'CreateOrganization'

export const createOrganization = async (
  params: CreateOrganizationParams,
  options: CreateOrganizationOptions,
): Promise<CreateOrganizationResult> =>
  callKetalMethod<CreateOrganizationParams, CreateOrganizationResult>(
    method,
    params,
    options,
  )
