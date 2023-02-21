import { ACCOUNT_LOGIN_ROUTE } from '~~/constants/routes/account'

import { useAccount } from '~~/stores/account'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const toPath = to.path

  // const localePath = useLocalePath()

  // const matchedRoute = ALL_ROUTES.find(
  //   (route) => localePath(route.path) === toPath
  // )

  const account = useAccount()
  if (account.authenticated === false) {
    try {
      await account.refreshToken()
      // TODO: add something to check if the route is a host only route
      // if (account.isHost === false) {
      // return navigateTo(ACCOUNT_ROUTE.path)
      // }
    } catch (error) {
      // if (matchedRoute?.auth === true) {
      return navigateTo(ACCOUNT_LOGIN_ROUTE.path)
      // }
    }
  }
})
