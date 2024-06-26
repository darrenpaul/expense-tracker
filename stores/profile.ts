import { defineStore } from 'pinia'
import { useAccounts } from './accounts'
import { useCategories } from './categories'
import { useTransactions } from './transactions'
import { useUserSettings } from './userSettings'
import { useGoals } from './goals'
import { useBudgets } from './budgets'
import { authLogin, authRefreshToken, authLogout } from '~~/endpoints/auth'
import { ACCESS_TOKEN_COOKIE } from '~~/constants/settings'
import { IUser } from '~~/types/user'
import { deleteUserAccount } from '~~/endpoints/users'

export const useProfile = defineStore({
  id: 'profile',

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
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email,
      }

      this.token = token
    },
    async logout() {
      useCookie(ACCESS_TOKEN_COOKIE).value = null

      this.user = null
      this.token = null
      this.clearAllData()
      await authLogout()
    },
    // WARNING: this deletes the user and all their information
    async handleDeleteProfile() {
      await deleteUserAccount(this.userId)
      await this.logout()
    },
    async refreshToken() {
      const { record, token } = await authRefreshToken()

      this.user = {
        id: record.id,
        username: record.username,
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email,
      }
      this.token = token

      this.fetchAllData()
    },
    async fetchAllData() {
      await useUserSettings().fetch()
      await useTransactions().fetch()
      await useAccounts().fetch()
      await useCategories().fetch()
      await useGoals().fetch()
      await useBudgets().fetch()
    },
    clearAllData() {
      useTransactions().clear()
      useAccounts().clear()
      useCategories().clear()
      useBudgets().clear()
      useGoals().clear()
      useUserSettings().clear()
    },
  },
})
