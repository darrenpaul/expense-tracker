import { ICategory } from '~~/types/category'
import { INewTransaction, ITransaction } from '~~/types/transaction'

const TABLE = 'transactions'

// ---------- CREATE
export const createTransaction = async (data: INewTransaction) => {
  const pocketBaseClient = await usePocketBase()
  return await pocketBaseClient.collection(TABLE).create(data)
}

// ---------- VIEW
export const viewTransactions = async () => {
  const pocketBaseClient = usePocketBase()

  const records = await pocketBaseClient.collection(TABLE).getFullList(200, {
    expand: 'categoryId',
    sort: '-date',
  })

  return records.map((record) => {
    const category: ICategory = {
      id: record.expand.categoryId.id,
      transactionType: record.expand.categoryId.transactionType,
      name: record.expand.categoryId.name,
      icon: record.expand.categoryId.icon,
    }

    return {
      id: record.id,
      userId: record.userId,
      type: record.type,
      name: record.name,
      note: record.note,
      category,
      amount: record.amount,
      currency: record.currency,
      date: record.date,
    } as ITransaction
  })
}

// ---------- UPDATE
export const updateTransaction = async (transaction: ITransaction) => {
  const pocketBaseClient = usePocketBase()
  const { id } = transaction

  return await pocketBaseClient.collection(TABLE).update(id, transaction)
}
// ---------- DELETE
export const deleteTransaction = async (id: string) => {
  const pocketBaseClient = usePocketBase()
  return await pocketBaseClient.collection(TABLE).delete(id)
}
