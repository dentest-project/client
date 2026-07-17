import { login } from './endpoints/login'
import { register } from './endpoints/register'
import { requestPasswordReset } from './endpoints/requestPasswordReset'

export const ketalApi = {
  login,
  requestPasswordReset,
  register
}

export type KetalApi = typeof ketalApi

export * from './endpoints'
export * from './errors'
