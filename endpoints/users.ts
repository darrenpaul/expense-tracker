import { IUserRegister } from '~~/types/user'

const TABLE = 'users'

// ---------- CREATE
export const createUserAccount = async (userData: IUserRegister) => {
  const pocketBaseClient = await usePocketBase()
  const data = {
    ...userData,
    emailVisibility: true,
  }

  return await pocketBaseClient.collection(TABLE).create(data)
}

// ---------- VIEW

// ---------- UPDATE

// ---------- DELETE
export const deleteUserAccount = async (userId: string) => {
  const pocketBaseClient = await usePocketBase()

  return await pocketBaseClient.collection(TABLE).delete(userId)
}
