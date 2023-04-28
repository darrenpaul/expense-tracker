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

    <ul class="mb-6">
      <h3>Darren Paul</h3>
      <li v-for="todo in todos" :key="todo.id">
        <div
          v-if="todo.assignedTo === 'darrenpaul'"
          class="card w-full md:w-1/2 mb-3"
        >
          <div class="flex items-center justify-between">
            <h3>{{ todo.title }}</h3>
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
          <p>{{ todo.description }}</p>
        </div>
      </li>
    </ul>

    <h3>Thalia Rabie</h3>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <div v-if="todo.assignedTo === 'thaliarabie'" class="card mb-3">
          <h3>{{ todo.title }}</h3>
          <p>{{ todo.description }}</p>
          <p>{{ todo.label }}</p>
          <p>{{ todo.assignedTo }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Dropdown from '~~/components/Dropdown/index.vue'

import { createTodo, viewTodos } from '~~/endpoints/todo'
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

const functionality = ref([
  'Add option to remove the budget total amount from the balance on creation. This allows you to easily track your remaining money',
  'Add reoccurring transactions',
  'Add page where you can track all your subscriptions',
  'Add transaction filter, day, week(default), month, year, all, date, transaction type, account, amount range and category',
  'Display only this months transaction, and click to show more',
])

const bugs = ref(['Fix issue with date picker not start from selected date'])

const icons = ref([
  'Car (From side view)',
  'Motor Bike',
  'Bicycle',
  'Doctor/Hospital/Health Care',
  'Money Transfer Icon',
  'Clothing',
])

const labelColor = (label: string) => {
  if (label === 'bug') return 'bg-red-300'
  if (label === 'feature') return 'bg-blue-300'
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
