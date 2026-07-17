import { login } from './endpoints/login'
import { register } from './endpoints/register'

export const ketalApi = {
  login,
  register
}

export type KetalApi = typeof ketalApi

export * from './endpoints'
export * from './errors'
