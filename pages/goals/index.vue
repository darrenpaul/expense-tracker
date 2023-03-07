<template>
  <div>
    <h1>Goals</h1>

    <button @click="() => (showModal = true)">
      {{ COMMON_COPY.addGoal }}
    </button>

    <div class="grid-3-col">
      <GoalCard
        v-for="{ id, name, date, amount } in goalStore.goals"
        :key="id"
        :goal-id="id"
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
import { COMMON_COPY } from '~~/constants/copy'
import GoalForm from '~~/components/forms/GoalForm.vue'
import { useAccounts } from '~~/stores/accounts'
import { useUserSettings } from '~~/stores/userSettings'
import { useGoals } from '~~/stores/goals'
import { useTransactions } from '~~/stores/transactions'
import ProgressBar from '~~/components/ProgressBar/index.vue'
import GoalCard from '~~/components/goals/GoalCard.vue'
import { formatDate } from '~~/helpers/dateTimeHelper'

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const accountStore = useAccounts()
const userSettingStore = useUserSettings()
const goalStore = useGoals()
const transactionStore = useTransactions()

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
