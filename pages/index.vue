<template>
  <div>
    <ExpenseForm @created-expense="() => refresh()" />
    <ExpenseList v-if="expenses" :expenses="expenses" />
    <CategoryForm />
  </div>
</template>

<script setup lang="ts">
import ExpenseForm from '~~/components/expenses/ExpenseForm.vue'
import ExpenseList from '~~/components/expenses/ExpenseList.vue'
import CategoryForm from '~~/components/CategoryForm/index.vue'
import { viewExpenses } from '~~/endpoints/expense'

const { data: expenses, refresh } = await useAsyncData('expenses', () =>
  viewExpenses()
)

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
})
</script>
