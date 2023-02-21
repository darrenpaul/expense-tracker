<template>
  <div>
    <h1>{{ CATEGORY_COPY.addCategory }}</h1>
    <form>
      <!-- NAME -->
      <div class="input-group">
        <label for="name">{{ CATEGORY_COPY.category }}</label>
        <input
          v-model="name"
          :placeholder="CATEGORY_COPY.categoryPlaceholder"
          name="name"
          type="text"
        />
      </div>

      <button @click="onAddCategory">{{ COMMON_COPY.add }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { COMMON_COPY, CATEGORY_COPY } from '~~/constants/copy'
import { useAccount } from '~~/stores/account'
import { createExpense } from '~~/endpoints/category'
import { INewCategory } from '~~/types/category'

const emit = defineEmits(['createdCategory'])

const account = useAccount()

const name = ref('')

const onAddCategory = async (event: Event) => {
  event.preventDefault()

  if (!account.userId) return

  const data: INewCategory = {
    userId: account.userId,
    displayName: name.value,
  }

  await createExpense(data)
  alert('Added category')
  emit('createdCategory')
}
</script>
