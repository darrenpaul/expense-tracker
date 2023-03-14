<template>
  <div>
    <div class="row between items-center my-4">
      <h2>{{ BUDGET_COPY.budgets }}</h2>

      <button class="button-secondary" @click="() => (showModal = true)">
        {{ BUDGET_COPY.addBudget }}
      </button>
    </div>

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
import BUDGET_COPY from '~~/constants/copy/budget'
import BudgetForm from '~~/components/forms/BudgetForm.vue'
import BudgetCard from '~~/components/cards/BudgetCard.vue'
import { useBudgets } from '~~/stores/budgets'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

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
