import { INewCategory, ICategory } from '~~/types/category'

const CATEGORIES_TABLE = 'categories'

// ---------- CREATE
export const createExpense = async (data: INewCategory) => {
  const pocketBaseClient = await usePocketBase()

  return await pocketBaseClient.collection(CATEGORIES_TABLE).create(data)
}

// ---------- VIEW
export const viewExpenses = async () => {
  const pocketBaseClient = usePocketBase()

  const records = await pocketBaseClient
    .collection(CATEGORIES_TABLE)
    .getFullList(200, { sort: '-created' })

  return records.map((record) => {
    return {
      id: record.id,
      userId: record.userId,
      displayName: record.displayName,
    } as ICategory
  })
}

// ---------- UPDATE

// ---------- DELETE
