<template>
  <div>
    <div class="card !py-2 flex flex-col items-start !bg-secondary-a">
      <h4>{{ props.account.name }}</h4>
      <h4 :class="textColor">
        <b>
          {{
            currencyFormat({
              value: currentBalance,
              currency: userSettingStore.currency,
            })
          }}
        </b>
      </h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IAccount } from '~~/types/account'
import { useTransactions } from '~~/stores/transactions'
import { useUserSettings } from '~~/stores/userSettings'
import { currencyFormat } from '~~/helpers/formatting'

const props = defineProps<{ account: IAccount }>()

const transactionStore = useTransactions()
const userSettingStore = useUserSettings()

const totalExpense = computed(() => {
  return transactionStore.expenseV2([props.account.id])
})

const totalIncome = computed(() => {
  return transactionStore.incomeV2([props.account.id])
})

const currentBalance = computed(() => {
  return totalIncome.value - totalExpense.value
})

const textColor = computed(() => {
  if (totalExpense.value > totalIncome.value) {
    return 'text-app-red'
  }

  return 'text-app-green'
})
</script>
