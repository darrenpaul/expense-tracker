<template>
  <div class="w-full h-full">
    <div class="card flex flex-col gap-3 w-full !h-full">
      <DashboardCardHeader
        :title="COPY.transactions"
        :url="TRANSACTIONS_ROUTE.path"
      />

      <template v-if="dashboardAccounts.length === 0">
        <DashboardAccountCardSkeleton />
        <DashboardAccountCardSkeleton />
        <DashboardAccountCardSkeleton />
      </template>

      <div class="h-full grid grid-rows-3 gap-4">
        <TransitionGroup name="list">
          <DashboardTransactionCard
            v-for="transaction in dashboardTransactions"
            :key="transaction.id"
            :transaction="transaction"
          />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardCardHeader from '~~/components/pages/dashboard/DashboardCardHeader.vue'
import COPY from '~~/constants/copy/transactions'
import { TRANSACTIONS_ROUTE } from '~~/constants/routes/transactions'
import DashboardTransactionCard from '~~/components/pages/dashboard/DashboardTransactionCard.vue'
import DashboardAccountCardSkeleton from '~~/components/pages/dashboard/DashboardAccountCardSkeleton.vue'
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
