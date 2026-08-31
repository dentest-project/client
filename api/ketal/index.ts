import { login } from './endpoints/login'
import { register } from './endpoints/register'
import { requestPasswordReset } from './endpoints/requestPasswordReset'
import { resetPassword } from './endpoints/resetPassword'

export const ketalApi = {
  login,
  requestPasswordReset,
  resetPassword,
  register,
}

export type KetalApi = typeof ketalApi

export * from './endpoints'
export * from './errors'
