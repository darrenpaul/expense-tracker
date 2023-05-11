<template>
  <ClientOnly>
    <main class="main-layout-container">
      <DashboardNavigation />

      <section class="main-layout-content">
        <TransactionForm v-if="$route.query[TRANSACTION_FORM_ROUTE.queryKey]" />
        <AccountsForm v-else-if="$route.query[ACCOUNT_FORM_ROUTE.queryKey]" />
        <slot v-else />
      </section>

      <!-- <ActionButtons /> -->
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import DashboardNavigation from '~~/components/navigation/DashboardNavigation/index.vue'
import TransactionForm from '~~/components/forms/TransactionForm.vue'
import AccountsForm from '~~/components/forms/AccountsForm.vue'
import { TRANSACTION_FORM_ROUTE } from '~~/constants/routes/transactions'
import { clearQuery } from '~~/helpers/routerQuery'
import { ACCOUNT_FORM_ROUTE } from '~~/constants/routes/accounts'
// import ActionButtons from '~~/components/ActionButtons/index.vue'

onMounted(() => {
  clearQuery()
})
</script>
