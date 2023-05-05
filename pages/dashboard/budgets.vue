<template>
  <div>
    <HeadingWithButton
      :heading="BUDGET_COPY.budgets"
      :button-text="BUDGET_COPY.addBudget"
      @on-click="() => (showModal = true)"
    />

    <div class="flex flex-col md:grid md:grid-cols-3 gap-4">
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
import HeadingWithButton from '~~/components/HeadingWithButton.vue'
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
