import { INewExpense, IExpense } from '~~/types/expense'

const EXPENSE_TABLE = 'expenses'

// ---------- CREATE
export const createExpense = async (expenseData: INewExpense) => {
  const pocketBaseClient = await usePocketBase()

  return await pocketBaseClient.collection(EXPENSE_TABLE).create(expenseData)
}

// ---------- VIEW
export const viewExpenses = async () => {
  const pocketBaseClient = usePocketBase()

  const records = await pocketBaseClient
    .collection(EXPENSE_TABLE)
    .getFullList(200, { sort: '-created' })

  return records.map((record) => {
    return {
      id: record.id,
      userId: record.userId,
      note: record.note,
      amount: record.amount,
      date: record.date,
    } as IExpense
  })
}

// ---------- UPDATE

// ---------- DELETE
