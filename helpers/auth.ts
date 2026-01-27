import type { Session, User } from '~/types'

const loggedInUser = (sessionData): User => {
  return sessionData ? (sessionData as Session).user : {
    id: '',
    username: '',
    email: '',
    roles: []
  }
}

const isAuthenticated = (sessionStatus: string, sessionData?: Session | null) => {
  if (sessionStatus === 'authenticated') {
    return true
  }

  return sessionStatus === 'loading' && !!sessionData
}

export { loggedInUser, isAuthenticated }
