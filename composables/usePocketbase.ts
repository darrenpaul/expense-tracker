import PocketBase from 'pocketbase'
import { ACCESS_TOKEN_COOKIE } from '~~/constants/settings'

export const usePocketBase = () => {
  const config = useRuntimeConfig()
  const token = useCookie(ACCESS_TOKEN_COOKIE).value

  const pocketBaseClient = new PocketBase(config.pocketBaseUrl)
  if (token) {
    pocketBaseClient.authStore.save(token, { verified: false })
  } else {
    pocketBaseClient.authStore.clear()
  }

  return pocketBaseClient
}
