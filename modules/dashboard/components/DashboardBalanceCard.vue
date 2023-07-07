<template>
  <div class="dashboard-glance-card">
    <h4 class="font-normal">{{ COPY.balance }}</h4>

    <h3 class="font-black">
      {{ balance }}
    </h3>
  </div>
</template>

<script setup lang="ts">
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import { currencyFormat } from '~~/helpers/formatting'
import COPY from '~~/constants/copy/transactions'

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()

const balance = computed(() => {
  return currencyFormat({
    value: transactionStore.balance(),
    currency: userSettingStore.currency,
  })
})
</script>
