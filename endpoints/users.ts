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
