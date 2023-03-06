import {
  PROFILE_LOGIN_ROUTE,
  PROFILE_SETTINGS_ROUTE,
} from '~~/constants/routes/profile'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { HOME_ROUTE } from '~~/constants/routes/home'

import { useProfile } from '~~/stores/profile'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const toPath = to.path

  const matchedRoute = [
    HOME_ROUTE,
    DASHBOARD_ROUTE,
    PROFILE_SETTINGS_ROUTE,
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
