import { register } from './endpoints/register'

export const ketalApi = {
  register
}

export type KetalApi = typeof ketalApi

export * from './endpoints'
export * from './errors'
