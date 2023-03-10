<template>
  <div>
    <h1>{{ COMMON_COPY.budgets }}</h1>

    <button class="button" @click="() => (showModal = true)">
      {{ COMMON_COPY.addBudget }}
    </button>

    <div class="grid-3-col">
      <BudgetCard
        v-for="budget in budgetStore.budgets"
        :key="budget.id"
        :budget="budget"
        @on-edit="onBudgetEdit"
      />
    </div>

    <Modal :is-open="showModal" @close="onCloseModal">
      <BudgetForm :budget="budgetActive" @close-modal="onCloseModal" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { COMMON_COPY } from '~~/constants/copy'
import BudgetForm from '~~/components/forms/BudgetForm.vue'
import { useGoals } from '~~/stores/goals'
import BudgetCard from '~~/components/cards/BudgetCard.vue'
import { useCategories } from '~~/stores/categories'
import { useBudgets } from '~~/stores/budgets'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const goalStore = useGoals()
const categoryStore = useCategories()
const budgetStore = useBudgets()

const showModal = ref(false)
const budgetActive = ref({})

const onCloseModal = () => {
  showModal.value = false
  budgetActive.value = {}
}

const onBudgetEdit = (budgetId: string) => {
  const matchEntity = budgetStore.budgets.find(({ id }) => id === budgetId)

  if (matchEntity) {
    budgetActive.value = matchEntity
    showModal.value = true
  }
}
</script>
