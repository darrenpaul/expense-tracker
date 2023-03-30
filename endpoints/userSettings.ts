import { INewUserSettings, IUserSettings } from '~~/types/userSettings'

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
    monthStart: record.monthStart,
  } as IUserSettings
}

// ---------- UPDATE
export const updateUserSettings = async (userSettings: IUserSettings) => {
  const pocketBaseClient = await usePocketBase()

  const { id } = userSettings

  return await pocketBaseClient.collection(TABLE).update(id, userSettings)
}

// ---------- DELETE
