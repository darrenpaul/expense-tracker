<template>
  <div class="dashboard-card-list">
    <DashboardCardHeader
      :title="COPY.transactions"
      :url="TRANSACTIONS_ROUTE.path"
    />

    <template v-if="dashboardAccounts.length === 0">
      <DashboardAccountCardSkeleton />
      <DashboardAccountCardSkeleton />
      <DashboardAccountCardSkeleton />
    </template>

    <div class="--list-wrapper">
      <TransitionGroup name="list">
        <DashboardTransactionCard
          v-for="transaction in dashboardTransactions"
          :key="transaction.id"
          :transaction="transaction"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardCardHeader from '~~/modules/dashboard/components/DashboardCardHeader.vue'
import DashboardTransactionCard from '~~/modules/dashboard/components/DashboardTransactionCard.vue'
import DashboardAccountCardSkeleton from '~~/modules/dashboard/components/DashboardAccountCardSkeleton.vue'
import COPY from '~~/constants/copy/transactions'
import { TRANSACTIONS_ROUTE } from '~~/constants/routes/transactions'
import { useAccounts } from '~~/stores/accounts'
import { useTransactions } from '~~/stores/transactions'

const accountStore = useAccounts()
const transactionStore = useTransactions()

const dashboardTransactions = computed(() => {
  return transactionStore.transactions.slice(0, 3)
})

const dashboardAccounts = computed(() => {
  const NotGoalAccounts = accountStore.accounts.filter(
    ({ name }) => !name.includes('Goal')
  )

  return NotGoalAccounts.slice(0, 3)
})
</script>
