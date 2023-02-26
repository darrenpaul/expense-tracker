import {
  ACCOUNT_LOGIN_ROUTE,
  ACCOUNT_SETTINGS_ROUTE,
} from '~~/constants/routes/account'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { HOME_ROUTE } from '~~/constants/routes/home'

import { useAccount } from '~~/stores/account'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const toPath = to.path

  const matchedRoute = [
    HOME_ROUTE,
    DASHBOARD_ROUTE,
    ACCOUNT_SETTINGS_ROUTE,
  ].find((route) => route.path === toPath)

  const account = useAccount()
  if (account.authenticated === false) {
    try {
      await account.refreshToken()
    } catch (error) {
      if (matchedRoute?.auth === true) {
        return navigateTo(ACCOUNT_LOGIN_ROUTE.path)
      }
    }
  }
})
