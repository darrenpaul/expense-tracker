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
    .getFullList(200, { sort: '+name' })

  return records.map((record) => {
    return {
      id: record.id,
      userId: record.userId,
      transactionType: record.transactionType,
      name: record.name,
      icon: '',
    } as ICategory
  })
}

// ---------- UPDATE
export const updateCategory = async (category: ICategory) => {
  const pocketBaseClient = usePocketBase()
  const { id } = category

  return await pocketBaseClient.collection(TABLE).update(id, category)
}
// ---------- DELETE
export const deleteCategory = async (id: string) => {
  const pocketBaseClient = usePocketBase()
  return await pocketBaseClient.collection(TABLE).delete(id)
}
