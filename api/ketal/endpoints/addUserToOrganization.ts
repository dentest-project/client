import { callKetalMethod } from '../jsonRpc'
import type { CallKetalMethodOptions } from '../jsonRpc'

export interface AddUserToOrganizationParams {
  organizationId: string
  userId: string
}

export interface AddUserToOrganizationOptions extends CallKetalMethodOptions {
  authorization: string
}

export interface AddUserToOrganizationResult {
  organization: {
    id: string
    name: string
    slug: string
  }
  user: {
    id: string
    username: string
    email: string
  }
  permissions: Array<'admin' | 'project_create' | 'project_write' | 'read'>
}

export enum AddUserToOrganizationErrorCode {
  AccessDenied = -32001,
  UserNotAllowedToAdministrateOrganization = 20013,
  UserAlreadyPartOfOrganization = 20012,
  OrganizationNotFound = 20011,
  UserNotFound = 20007,
  GatewayError = 20002,
  UnexpectedError = 20009,
}

const method = 'AddUserToOrganization'

export const addUserToOrganization = async (
  params: AddUserToOrganizationParams,
  options: AddUserToOrganizationOptions,
): Promise<AddUserToOrganizationResult> =>
  callKetalMethod<AddUserToOrganizationParams, AddUserToOrganizationResult>(
    method,
    params,
    options,
  )
