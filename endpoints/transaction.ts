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

  const records = await pocketBaseClient
    .collection(TABLE)
    .getFullList(200, { sort: '+date' })

  return records.map((record) => {
    return {
      id: record.id,
      userId: record.userId,
      type: record.type,
      note: record.note,
      amount: record.amount,
      date: record.date,
    } as ITransaction
  })
}

// ---------- UPDATE

// ---------- DELETE
export const deleteTransaction = async (id: string) => {
  const pocketBaseClient = usePocketBase()
  return await pocketBaseClient.collection(TABLE).delete(id)
}
