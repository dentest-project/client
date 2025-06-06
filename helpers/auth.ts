import type { Session, User } from '~/types'

const loggedInUser = (sessionData): User => {
  return sessionData ? (sessionData as Session).user : {
    id: '',
    username: '',
    email: '',
    roles: []
  }
}

const isAuthenticated = (sessionStatus) => {
  return sessionStatus === 'authenticated'
}

export { loggedInUser, isAuthenticated }
