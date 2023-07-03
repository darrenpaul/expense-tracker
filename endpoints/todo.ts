import { ITodo, INewTodo } from '~~/types/todo'

const TABLE = 'todos'

// ---------- CREATE
export const createTodo = async (data: INewTodo) => {
  const pocketBaseClient = await usePocketBase()
  const { id, title, description, label, assignedTo, status } =
    await pocketBaseClient.collection(TABLE).create(data)

  return {
    id,
    title,
    description,
    label,
    assignedTo,
    status,
  } as ITodo
}

// ---------- VIEW
export const viewTodos = async () => {
  const pocketBaseClient = usePocketBase()

  const records = await pocketBaseClient.collection(TABLE).getFullList(200, {
    sort: '+created',
  })

  return records
    .map(({ id, title, description, label, assignedTo, status }) => {
      return {
        id,
        title,
        description,
        label,
        assignedTo,
        status,
      } as ITodo
    })
    .filter((todo) => todo.status !== 'complete')
}

// ---------- UPDATE
export const markTodoAsComplete = async (todoId: string) => {
  const pocketBaseClient = usePocketBase()

  const { id, title, description, label, assignedTo, status } =
    await pocketBaseClient
      .collection(TABLE)
      .update(todoId, { status: 'complete' })

  return {
    id,
    title,
    description,
    label,
    assignedTo,
    status,
  } as ITodo
}

export const markTodoAsIncomplete = async (todoId: string) => {
  const pocketBaseClient = usePocketBase()

  const { id, title, description, label, assignedTo, status } =
    await pocketBaseClient
      .collection(TABLE)
      .update(todoId, { status: 'incomplete' })

  return {
    id,
    title,
    description,
    label,
    assignedTo,
    status,
  } as ITodo
}

// // ---------- DELETE
// export const deleteTodo = async (id: string) => {
//   const pocketBaseClient = usePocketBase()
//   return await pocketBaseClient.collection(TABLE).delete(id)
// }
