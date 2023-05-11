import {
  PROFILE_LOGIN_ROUTE,
  PROFILE_SETTINGS_ROUTE,
} from '~~/constants/routes/profile'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { HOME_ROUTE } from '~~/constants/routes/home'

import { useProfile } from '~~/stores/profile'
import { TRANSACTIONS_ROUTE } from '~~/constants/routes/transactions'
import { ACCOUNTS_ROUTE } from '~~/constants/routes/accounts'
import { GOALS_ROUTE } from '~~/constants/routes/goals'
import { BUDGETS_ROUTE } from '~~/constants/routes/budgets'
import { CATEGORIES_ROUTE } from '~~/constants/routes/categories'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const toPath = to.path

  const matchedRoute = [
    HOME_ROUTE,
    DASHBOARD_ROUTE,
    PROFILE_SETTINGS_ROUTE,
    TRANSACTIONS_ROUTE,
    ACCOUNTS_ROUTE,
    GOALS_ROUTE,
    BUDGETS_ROUTE,
    CATEGORIES_ROUTE,
  ].find((route) => route.path === toPath)

  const profile = useProfile()
  if (profile.authenticated === false) {
    try {
      await profile.refreshToken()
    } catch (error) {
      if (matchedRoute?.auth === true) {
        return navigateTo(PROFILE_LOGIN_ROUTE.path)
      }
    }
  }
})
