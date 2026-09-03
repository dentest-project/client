import { login } from './endpoints/login'
import { register } from './endpoints/register'
import { requestPasswordReset } from './endpoints/requestPasswordReset'
import { resetPassword } from './endpoints/resetPassword'
import { updateMyPersonalInformation } from './endpoints/updateMyPersonalInformation'
import { whoAmI } from './endpoints/whoAmI'

export const ketalApi = {
  login,
  requestPasswordReset,
  resetPassword,
  register,
  updateMyPersonalInformation,
  whoAmI,
}

export type KetalApi = typeof ketalApi

export * from './endpoints'
export * from './errors'
