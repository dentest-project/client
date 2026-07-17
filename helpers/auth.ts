import type { Session, User } from '~/types'
import type { LoginParams } from '~/api/ketal'

const loggedInUser = (sessionData?: Session | null): User => {
  return sessionData ? sessionData.user : {
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

const logIn = async (credentials: LoginParams): Promise<void> => {
  const { $ketal } = useNuxtApp()
  const { setToken } = useAuthState()
  const { getSession } = useAuth()

  const { token } = await $ketal.login(credentials)

  setToken(token)
  await getSession()
}

export { loggedInUser, isAuthenticated, logIn }
