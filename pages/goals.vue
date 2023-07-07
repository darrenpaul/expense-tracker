<template>
  <div>
    <HeadingWithButton
      :heading="GOAL_COPY.goals"
      :button-text="GOAL_COPY.add"
      @on-click="() => (showModal = true)"
    />

    <div class="flex flex-col md:grid-3-col">
      <GoalCard
        v-for="{ id, accountId, name, date, amount } in goalStore.goals"
        :key="id"
        :goal-id="id"
        :account-id="accountId"
        :name="name"
        :amount="amount"
        :date="date"
        @on-edit="onGoalEdit"
      />
    </div>

    <Modal :is-open="showModal" @close="onCloseAccountsModal">
      <GoalForm :goal="goal" @close-modal="onCloseAccountsModal" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import HeadingWithButton from '~~/components/HeadingWithButton.vue'
import GOAL_COPY from '~~/constants/copy/goals'
import GoalForm from '~~/components/forms/GoalForm.vue'
import { useGoals } from '~~/stores/goals'
import GoalCard from '~~/components/cards/GoalCard.vue'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'dashboard',
})

const goalStore = useGoals()

const showModal = ref(false)
const goal = ref({})

const onCloseAccountsModal = () => {
  showModal.value = false
  goal.value = {}
}

const onGoalEdit = (goalId: string) => {
  const matchEntity = goalStore.goals.find(({ id }) => id === goalId)

  if (matchEntity) {
    goal.value = matchEntity
    showModal.value = true
  }
}
</script>
