import { IAccount, INewAccount } from '~~/types/account'
import { ICategory } from '~~/types/category'
import { INewTransaction, ITransaction } from '~~/types/transaction'

const TABLE = 'accounts'

// ---------- CREATE
export const createAccount = async (data: INewAccount) => {
  const pocketBaseClient = await usePocketBase()
  return await pocketBaseClient.collection(TABLE).create(data)
}

// ---------- VIEW
export const viewAccounts = async () => {
  const pocketBaseClient = usePocketBase()

  const records = await pocketBaseClient.collection(TABLE).getFullList(200, {
    sort: '+name',
    expand: 'accountId',
  })

  return records.map((record) => {
    return {
      id: record.id,
      userId: record.userId,
      name: record.name,
      includeInBalance: record.includeInBalance,
    } as IAccount
  })
}

// ---------- UPDATE
export const updateAccount = async (account: IAccount) => {
  const pocketBaseClient = usePocketBase()
  const { id } = account

  return await pocketBaseClient.collection(TABLE).update(id, account)
}
// ---------- DELETE
export const deleteAccount = async (id: string) => {
  const pocketBaseClient = usePocketBase()
  return await pocketBaseClient.collection(TABLE).delete(id)
}
