<template>
  <main class="dashboard-layout-container">
    <DashboardNavigation />

    <section class="dashboard-layout-content">
      <TransactionForm v-if="$route.query[TRANSACTION_FORM_ROUTE.queryKey]" />
      <AccountForm v-else-if="$route.query[ACCOUNT_FORM_ROUTE.queryKey]" />
      <slot v-else />
    </section>
  </main>
</template>

<script setup lang="ts">
import DashboardNavigation from '~~/components/navigation/DashboardNavigation/index.vue'
import TransactionForm from '~~/components/pages/transaction/TransactionForm.vue'
import AccountForm from '~~/components/pages/account/AccountForm.vue'
import { TRANSACTION_FORM_ROUTE } from '~~/constants/routes/transactions'
import { clearQuery } from '~~/helpers/routerQuery'
import { ACCOUNT_FORM_ROUTE } from '~~/constants/routes/accounts'
// import ActionButtons from '~~/components/ActionButtons/index.vue'

onMounted(() => {
  clearQuery()
})
</script>
