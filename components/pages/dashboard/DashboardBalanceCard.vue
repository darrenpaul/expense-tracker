<template>
  <div class="dashboard-balance-card">
    <!-- BALANCE -->
    <div>
      <h4 class="font-normal">{{ COPY.balance }}</h4>
      <h3 class="font-black">
        {{ balance }}
      </h3>
      <!-- <small>{{ COPY.actualBalance }}</small> -->
    </div>
    <!-- <button
      type="button"
      class="button !w-fit !h-fit !p-2 !m-0"
      @click="onAddTransaction"
    >
      <CrossIcon size="18" />
    </button> -->
  </div>
</template>

<script setup lang="ts">
import { currencyFormat } from '~~/helpers/formatting'
import COPY from '~~/constants/copy/transactions'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import CrossIcon from '~~/components/icons/CrossIcon.vue'
import { TRANSACTION_FORM_ROUTE } from '~~/constants/routes/transactions'
import { addQuery } from '~~/helpers/routerQuery'

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()

const balance = computed(() => {
  return currencyFormat({
    value: transactionStore.balance(),
    currency: userSettingStore.currency,
  })
})

const onAddTransaction = () => {
  const accountQuery = { [TRANSACTION_FORM_ROUTE.queryKey]: 'new' }
  addQuery(accountQuery)
}
</script>
