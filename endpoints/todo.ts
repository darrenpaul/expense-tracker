import { ITodo, INewTodo } from '~~/types/todo'

const TABLE = 'todos'

// ---------- CREATE
export const createTodo = async (data: INewTodo) => {
  const pocketBaseClient = await usePocketBase()
  const { id, title, description, label, assignedTo } = await pocketBaseClient
    .collection(TABLE)
    .create(data)

  return {
    id,
    title,
    description,
    label,
    assignedTo,
  } as ITodo
}

// ---------- VIEW
export const viewTodos = async () => {
  const pocketBaseClient = usePocketBase()

  const records = await pocketBaseClient.collection(TABLE).getFullList(200, {
    sort: '+created',
  })

  return records.map(({ id, title, description, label, assignedTo }) => {
    return {
      id,
      title,
      description,
      label,
      assignedTo,
    } as ITodo
  })
}

// // ---------- UPDATE
// export const updateTodo = async (goal: IGoal) => {
//   const pocketBaseClient = usePocketBase()
//   const { id } = goal

//   const { accountId, name, amount, date, note } = await pocketBaseClient
//     .collection(TABLE)
//     .update(id, goal)

//   return {
//     id,
//     accountId,
//     name,
//     amount,
//     date,
//     note,
//   } as IGoal
// }
// // ---------- DELETE
// export const deleteTodo = async (id: string) => {
//   const pocketBaseClient = usePocketBase()
//   return await pocketBaseClient.collection(TABLE).delete(id)
// }
