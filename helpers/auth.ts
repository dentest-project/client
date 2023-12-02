import { SessionData } from '#auth'
import { SessionStatus } from '@sidebase/nuxt-auth/dist/runtime/types'
import type { Session, User } from '~/types'

const loggedInUser = (sessionData?: SessionData | null): User => {
  return sessionData ? (sessionData as Session).user : {
    id: '',
    username: '',
    email: '',
    roles: []
  }
}

const isAuthenticated = (sessionStatus: SessionStatus) => {
  return sessionStatus === 'authenticated'
}

export { loggedInUser, isAuthenticated }
