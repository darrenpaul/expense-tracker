import { IAccount, INewAccount } from '~~/types/account'
import { ICategory } from '~~/types/category'
import { IGoal, INewGoal } from '~~/types/goal'
import { INewTransaction, ITransaction } from '~~/types/transaction'

const TABLE = 'goals'

// ---------- CREATE
export const createGoal = async (data: INewGoal) => {
  const pocketBaseClient = await usePocketBase()
  const { id, name, amount, date, note } = await pocketBaseClient
    .collection(TABLE)
    .create(data)

  return {
    id,
    name,
    amount,
    date,
    note,
  } as IGoal
}

// ---------- VIEW
export const viewGoals = async () => {
  const pocketBaseClient = usePocketBase()

  const records = await pocketBaseClient.collection(TABLE).getFullList(200, {
    sort: '+date',
  })

  return records.map(({ id, name, amount, date, note }) => {
    return {
      id,
      name,
      amount,
      date,
      note,
    } as IGoal
  })
}

// ---------- UPDATE
export const updateGoal = async (goal: IGoal) => {
  const pocketBaseClient = usePocketBase()
  const { id } = goal

  const { name, amount, date, note } = await pocketBaseClient
    .collection(TABLE)
    .update(id, goal)

  return {
    id,
    name,
    amount,
    date,
    note,
  } as IGoal
}
// ---------- DELETE
export const deleteGoal = async (id: string) => {
  const pocketBaseClient = usePocketBase()
  return await pocketBaseClient.collection(TABLE).delete(id)
}
