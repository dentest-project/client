import { addUserToOrganization } from './endpoints/addUserToOrganization'
import { createOrganization } from './endpoints/createOrganization'
import { listMyOrganizations } from './endpoints/listMyOrganizations'
import { login } from './endpoints/login'
import { register } from './endpoints/register'
import { requestPasswordReset } from './endpoints/requestPasswordReset'
import { resetPassword } from './endpoints/resetPassword'
import { updateMyPersonalInformation } from './endpoints/updateMyPersonalInformation'
import { whoAmI } from './endpoints/whoAmI'
import type {
  AddUserToOrganizationParams,
  CreateOrganizationParams,
  UpdateMyPersonalInformationParams,
} from './endpoints'

export const createKetalApi = (getAuthorization: () => string | null) => {
  const getAuthenticationOptions = () => ({
    authorization: getAuthorization() ?? '',
  })

  return {
    addUserToOrganization: (params: AddUserToOrganizationParams) =>
      addUserToOrganization(params, getAuthenticationOptions()),
    createOrganization: (params: CreateOrganizationParams) =>
      createOrganization(params, getAuthenticationOptions()),
    listMyOrganizations: () => listMyOrganizations(getAuthenticationOptions()),
    login,
    requestPasswordReset,
    resetPassword,
    register,
    updateMyPersonalInformation: (params: UpdateMyPersonalInformationParams) =>
      updateMyPersonalInformation(params, getAuthenticationOptions()),
    whoAmI: () => whoAmI(getAuthenticationOptions()),
  }
}

export type KetalApi = ReturnType<typeof createKetalApi>

export * from './endpoints'
export * from './errors'
