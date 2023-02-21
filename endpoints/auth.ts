import { ACCESS_TOKEN_COOKIE } from '~~/constants/settings'

const USERS_TABLE = 'users'

export const authLogin = async (email: string, password: string) => {
  const pocketBaseClient = await usePocketBase()
  return await pocketBaseClient
    .collection(USERS_TABLE)
    .authWithPassword(email, password)
}

export const authLogout = async () => {
  const pocketBaseClient = await usePocketBase()
  await pocketBaseClient.authStore.clear()
  useCookie(ACCESS_TOKEN_COOKIE).value = null
}

export const authRefreshToken = async () => {
  const pocketBaseClient = await usePocketBase()
  return pocketBaseClient.collection(USERS_TABLE).authRefresh()
}
