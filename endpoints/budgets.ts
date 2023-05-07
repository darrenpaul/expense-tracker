import { IBudget, INewBudget } from '~~/types/budget'

const TABLE = 'budgets'

// ---------- CREATE
export const createBudget = async (data: INewBudget) => {
  const pocketBaseClient = await usePocketBase()
  const {
    id,
    categoryIds,
    name,
    amount,
    startDate,
    endDate,
    note,
    adjustBalance,
  } = await pocketBaseClient.collection(TABLE).create(data)

  return {
    id,
    categoryIds,
    name,
    amount,
    startDate,
    endDate,
    note,
    adjustBalance,
  } as IBudget
}

// ---------- VIEW
export const viewBudgets = async () => {
  const pocketBaseClient = usePocketBase()
  const records = await pocketBaseClient.collection(TABLE).getFullList(200, {
    sort: '+name',
  })

  return records.map(
    ({
      id,
      categoryIds,
      name,
      amount,
      startDate,
      endDate,
      note,
      adjustBalance,
    }) => {
      return {
        id,
        categoryIds,
        name,
        amount,
        startDate,
        endDate,
        note,
        adjustBalance,
      } as IBudget
    }
  )
}

// ---------- UPDATE
export const updateBudget = async (budget: IBudget) => {
  const pocketBaseClient = usePocketBase()
  const { id } = budget

  const { categoryIds, name, amount, startDate, endDate, note, adjustBalance } =
    await pocketBaseClient.collection(TABLE).update(id, budget)

  return {
    id,
    categoryIds,
    name,
    amount,
    startDate,
    endDate,
    note,
    adjustBalance,
  } as IBudget
}
// ---------- DELETE
export const deleteBudget = async (id: string) => {
  const pocketBaseClient = usePocketBase()
  return await pocketBaseClient.collection(TABLE).delete(id)
}
