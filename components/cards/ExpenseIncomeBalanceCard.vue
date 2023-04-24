<template>
  <ClientOnly>
    <div class="card flex flex-col gap-3 w-full md:w-1/2">
      <div class="border-b pb-3 text-center">
        <h4>{{ TRANSACTION_COPY.balance }}</h4>

        <h3>
          {{
            currencyFormat({
              value: balance(),
              currency: userSettingStore.currency,
            })
          }}
        </h3>
      </div>

      <div class="border-b pb-3 text-center">
        <h4>{{ TRANSACTION_COPY.moneyIn }}</h4>
        <h3>
          {{
            currencyFormat({
              value: transactionStore.income(),
              currency: userSettingStore.currency,
            })
          }}
        </h3>
      </div>

      <div class="text-center">
        <h4>{{ TRANSACTION_COPY.moneyOut }}</h4>
        <h3>
          {{
            currencyFormat({
              value: transactionStore.expense(),
              currency: userSettingStore.currency,
            })
          }}
        </h3>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { balance } from '~~/helpers/transactions'
import { currencyFormat } from '~~/helpers/formatting'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()
</script>

<style lang="scss">
@import './cards.scss';
</style>
