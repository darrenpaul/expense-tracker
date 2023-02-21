import { IUserRegister } from '~~/types/user'

const USERS_TABLE = 'users'

// ---------- CREATE
export const createUserAccount = async (userData: IUserRegister) => {
  const pocketBaseClient = await usePocketBase()
  const data = {
    ...userData,
    emailVisibility: true,
  }

  return await pocketBaseClient.collection(USERS_TABLE).create(data)
}

// ---------- VIEW

// ---------- UPDATE

// ---------- DELETE
