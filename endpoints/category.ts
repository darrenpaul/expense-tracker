import { INewCategory, ICategory } from '~~/types/category'

const TABLE = 'categories'

// ---------- CREATE
export const createCategory = async (data: INewCategory) => {
  const pocketBaseClient = await usePocketBase()

  return await pocketBaseClient.collection(TABLE).create(data)
}

// ---------- VIEW
export const viewCategories = async () => {
  const pocketBaseClient = usePocketBase()

  const records = await pocketBaseClient
    .collection(TABLE)
    .getFullList(200, { sort: '+displayName' })

  return records.map((record) => {
    return {
      id: record.id,
      userId: record.userId,
      transactionType: record.transactionType,
      displayName: record.displayName,
    } as ICategory
  })
}

// ---------- UPDATE

// ---------- DELETE
