<template>
  <div class="mb-6">
    <form>
      <!-- TITLE -->
      <div class="input-group">
        <label class="label" for="title">Title</label>
        <input
          v-model="title"
          class="input"
          name="title"
          type="text"
          placeholder="Redesign UI"
        />
      </div>

      <!-- DESCRIPTION -->
      <div class="input-group">
        <label class="label" for="description">Description</label>
        <textarea
          v-model="description"
          class="textarea"
          name="description"
          type="text"
          placeholder="Redesign the UI for the Transaction page"
        />
      </div>

      <!-- LABEL -->
      <div class="input-group">
        <label class="label" for="label">Label</label>
        <Dropdown
          v-model="label"
          :options="labels"
          :selected="label"
          @selection-updated="label = $event"
        />
      </div>

      <!-- ASSIGNED TO -->
      <div class="input-group">
        <label class="label" for="assignedTo">Assigned To</label>
        <Dropdown
          v-model="assignedTo"
          :options="assignees"
          :selected="assignedTo"
          @selection-updated="assignedTo = $event"
        />
      </div>
      <button type="button" class="button" @click="onCreateTodo">Add</button>
    </form>

    <div class="grid grid-cols-2 w-full gap-4">
      <ul v-for="assignee in assignees" :key="assignee.value" class="mb-6">
        <h3>{{ assignee.label }}</h3>
        <li v-for="todo in todos" :key="todo.id">
          <div
            v-if="todo.assignedTo === assignee.value"
            class="card w-full mb-3"
          >
            <div class="flex items-center justify-between">
              <h3 :class="[todo.status === 'complete' && 'line-through']">
                {{ todo.title }}
              </h3>
              <div class="flex items-center gap-4">
                <p>
                  <b>{{ todo.assignedTo }}</b>
                </p>

                <p
                  :class="[
                    labelColor(todo.label),
                    'w-24 text-center p-2 rounded-xl',
                  ]"
                >
                  {{ todo.label }}
                </p>
              </div>
            </div>
            <p :class="[todo.status === 'complete' && 'line-through']">
              {{ todo.description }}
            </p>

            <button
              v-if="todo.status !== 'complete'"
              type="button"
              class="button"
              @click="() => onMarkTicketAsComplete(todo.id)"
            >
              Mark as Done
            </button>
            <button
              v-else
              type="button"
              class="button-secondary"
              @click="() => onMarkTicketAsIncomplete(todo.id)"
            >
              Mark as Incomplete
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import Dropdown from '~~/components/Dropdown/index.vue'

import {
  createTodo,
  viewTodos,
  markTodoAsComplete,
  markTodoAsIncomplete,
} from '~~/endpoints/todo'
import { useNotification } from '~~/stores/notification'
import { useProfile } from '~~/stores/profile'
import { INewTodo } from '~~/types/todo'

const profileStore = useProfile()
const notificationStore = useNotification()

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
})

const { data: todos, refresh } = await useAsyncData('todos', () => viewTodos())

const labels = ref([
  { value: 'feature', label: 'Feature' },
  { value: 'design', label: 'Design' },
  { value: 'bug', label: 'Bug' },
])

const assignees = ref([
  { value: 'darrenpaul', label: 'Darren Paul' },
  { value: 'thaliarabie', label: 'Thalia Rabie' },
])

const title = ref('')
const description = ref('')
const label = ref('')
const assignedTo = ref('')

const labelColor = (label: string) => {
  if (label === 'bug') return 'bg-red-300'
  if (label === 'feature') return 'bg-blue-300'
  if (label === 'design') return 'bg-green-300'
}

const onMarkTicketAsComplete = async (todoId: string) => {
  await markTodoAsComplete(todoId)
  refresh()
}

const onMarkTicketAsIncomplete = async (todoId: string) => {
  await markTodoAsIncomplete(todoId)
  refresh()
}

const onCreateTodo = async () => {
  if (!profileStore.userId) return
  const data = {
    userId: profileStore.userId,
    title: title.value,
    description: description.value,
    label: label.value,
    assignedTo: assignedTo.value,
  } as INewTodo

  await createTodo(data)

  notificationStore.addNotification({
    message: 'Created todo',
    type: 'success',
  })

  title.value = ''
  description.value = ''
  label.value = ''
  assignedTo.value = ''

  refresh()
}
</script>
