import { IAccount } from '~~/types/account'
import { ICategory } from '~~/types/category'
import { INewTransaction, ITransaction } from '~~/types/transaction'

const TABLE = 'transactions'

// ---------- CREATE
export const createTransaction = async (data: INewTransaction) => {
  const pocketBaseClient = await usePocketBase()
  return await pocketBaseClient.collection(TABLE).create(data)
}

// ---------- VIEW
interface IViewTransactions {
  date?: string
}
export const viewTransactions = async ({ date }: IViewTransactions) => {
  const pocketBaseClient = usePocketBase()
  const records = await pocketBaseClient.collection(TABLE).getFullList(200, {
    expand: 'categoryId,accountId',
    sort: '-date',
    filter: `date >= "${date}"`,
  })

  return records.map((record) => {
    let category: ICategory
    if (record.expand?.categoryId?.id) {
      category = {
        id: record.expand.categoryId.id,
        transactionType: record.expand.categoryId.transactionType,
        name: record.expand.categoryId.name,
        icon: record.expand.categoryId.icon,
      }
    }
    const account: IAccount = {
      id: record.expand.accountId?.id,
      includeInBalance: record.expand.accountId?.includeInBalance,
      name: record.expand.accountId?.name,
    }

    return {
      id: record.id,
      userId: record.userId,
      goalId: record.goalId,
      type: record.type,
      account,
      name: record.name,
      note: record.note,
      category,
      amount: record.amount,
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
