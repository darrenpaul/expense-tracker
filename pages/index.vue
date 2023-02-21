<template>
  <div>
    <ExpenseForm @created-expense="() => refresh()" />
    <ExpenseList v-if="expenses" :expenses="expenses" />
  </div>
</template>

<script setup lang="ts">
import ExpenseForm from '~~/components/ExpenseForm.vue'
import ExpenseList from '~~/components/ExpenseList.vue'
import { viewExpenses } from '~~/endpoints/expense'

const { data: expenses, refresh } = await useAsyncData('expenses', () =>
  viewExpenses()
)

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
})
</script>
