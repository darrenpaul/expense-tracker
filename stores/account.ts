import { defineStore } from 'pinia'
import { authLogin, authRefreshToken, authLogout } from '~~/endpoints/auth'
import { ACCESS_TOKEN_COOKIE } from '~~/constants/settings'
import { IUser } from '~~/types/user'

export const useAccount = defineStore({
  id: 'account',

  state: () => ({
    user: {} as IUser,
    token: useCookie(ACCESS_TOKEN_COOKIE).value,
  }),

  getters: {
    authenticated: (state) => !!state.user?.id,
    accessToken: (state) => state.token,
    userId: (state) => state.user?.id,
    userInformation: (state) => state.user,
  },

  actions: {
    async login(email: string, password: string) {
      const accessTokenCookie = useCookie(ACCESS_TOKEN_COOKIE)

      const { record, token } = await authLogin(email, password)
      accessTokenCookie.value = token

      this.user = {
        id: record.id,
        username: record.username,
        name: record.name,
        email: record.email,
      }

      this.token = token

      alert('logged in')
    },
    async logout() {
      useCookie(ACCESS_TOKEN_COOKIE).value = null
      this.user = null
      this.token = null
      await authLogout()
    },
    async refreshToken() {
      const { record, token } = await authRefreshToken()
      this.user = {
        id: record.id,
        username: record.username,
        name: record.name,
        email: record.email,
      }
      this.token = token
    },
  },
})
