<template>
  <div class="card !h-full flex flex-col gap-3 w-full">
    <!-- BALANCE -->
    <div>
      <h3>{{ COPY.balance }}</h3>
      <h2>
        <b>
          {{ balance }}
        </b>
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { currencyFormat } from '~~/helpers/formatting'
import COPY from '~~/constants/copy/transactions'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()

const balance = computed(() => {
  return currencyFormat({
    value: transactionStore.balance(),
    currency: userSettingStore.currency,
  })
})
</script>
