import { INewCategory, ICategory } from '~~/types/category'
import {
  INewUserSettings,
  IUpdateUserSettings,
  IUserSettings,
} from '~~/types/userSettings'

const TABLE = 'settings'

// ---------- CREATE
export const createUserSettings = async (data: INewUserSettings) => {
  const pocketBaseClient = await usePocketBase()

  return await pocketBaseClient.collection(TABLE).create(data)
}

// ---------- VIEW
export const viewUserSettings = async (userId: string) => {
  const pocketBaseClient = usePocketBase()

  const record = await pocketBaseClient
    .collection(TABLE)
    .getFirstListItem(`userId="${userId}"`, {})

  return {
    id: record.id,
    userId: record.userId,
    currency: record.currency,
  } as IUserSettings
}

// ---------- UPDATE
export const updateUserSettings = async (userSettings: IUserSettings) => {
  const pocketBaseClient = await usePocketBase()

  const { id, userId, currency } = userSettings
  const data: IUpdateUserSettings = {
    userId,
    currency,
  }

  return await pocketBaseClient.collection(TABLE).update(id, data)
}

// ---------- DELETE
