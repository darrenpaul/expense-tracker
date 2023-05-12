<template>
  <div class="w-full md:w-1/2">
    <div class="card flex flex-col gap-4 w-full">
      <DashboardCardHeader :title="COPY.accounts" :url="ACCOUNTS_ROUTE.path" />

      <template v-if="dashboardAccounts.length === 0">
        <AccountCardSkeleton />
        <AccountCardSkeleton />
        <AccountCardSkeleton />
      </template>

      <TransitionGroup name="list">
        <AccountCard
          v-for="account in dashboardAccounts"
          :key="account.id"
          :account="account"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardCardHeader from '~~/components/pages/dashboard/DashboardCardHeader.vue'
import COPY from '~~/constants/copy/account'
import { ACCOUNTS_ROUTE } from '~~/constants/routes/accounts'
import AccountCard from '~~/components/pages/dashboard/AccountCard.vue'
import AccountCardSkeleton from '~~/components/pages/dashboard/AccountCardSkeleton.vue'
import { useAccounts } from '~~/stores/accounts'

const dashboardAccounts = computed(() => {
  const NotGoalAccounts = accountStore.accounts.filter(
    ({ name }) => !name.includes('Goal')
  )

  return NotGoalAccounts.slice(0, 3)
})

const accountStore = useAccounts()
</script>
