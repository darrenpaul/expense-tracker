<template>
  <div class="card card-stretch">
    <div class="row centered between mb-2">
      <h3>
        {{ budget.name }}
      </h3>

      <button
        class="button-icon-transparent z-50"
        @click="expanded = !expanded"
      >
        <ArrowDownIcon v-if="expanded" />
        <ArrowUpIcon v-else />
      </button>
    </div>

    <template v-if="expanded">
      <button @click="emit('onEdit', budget.id)">{{ COMMON_COPY.edit }}</button>

      <div class="grid grid-cols-2">
        <p>{{ COMMON_COPY.startDate }}:</p>
        <p class="text-right">{{ formatDate(new Date(budget.startDate)) }}</p>
      </div>
      <div class="grid grid-cols-2">
        <p>{{ COMMON_COPY.endDate }}:</p>
        <p class="text-right">{{ formatDate(new Date(budget.endDate)) }}</p>
      </div>

      <div class="grid grid-cols-2">
        <p>{{ TRANSACTION_COPY.spendPerDay }}</p>
        <p class="text-right">{{ dailySpend }}</p>
      </div>

      <div class="grid grid-cols-2">
        <p>{{ TRANSACTION_COPY.spendPerWeek }}</p>
        <p class="text-right">{{ weeklySpend }}</p>
      </div>

      <!--



      <div class="grid grid-cols-2">
        <p>{{ COMMON_COPY.saveWeekly }}</p>
        <p class="text-right">{{ savePerWeek }}</p>
      </div>

      <div class="grid grid-cols-2">
        <p>{{ COMMON_COPY.saveMonthly }}</p>
        <p class="text-right">{{ savePerMonth }}</p>
      </div>

      <div class="grid grid-cols-2">
        <p>{{ COMMON_COPY.currentAmount }}</p>
        <p class="text-right">{{ balanceWithCurrency }}</p>
      </div>

      <div class="grid grid-cols-2 mb-2">
        <p>{{ COMMON_COPY.TargetAmount }}</p>
        <p class="text-right">{{ amountWithCurrency }}</p>
      </div> -->
    </template>

    <ProgressBar :current-amount="balance" :max-amount="budget.amount" />
  </div>
</template>

<script setup lang="ts">
import { COMMON_COPY, TRANSACTION_COPY } from '~~/constants/copy'
import { useUserSettings } from '~~/stores/userSettings'
import { useTransactions } from '~~/stores/transactions'
import ProgressBar from '~~/components/ProgressBar/index.vue'
import { formatDate } from '~~/helpers/dateTimeHelper'
import {
  spendPerDay,
  spendPerWeek,
  spendPerMonth,
  totalAmountTransactions,
} from '~~/helpers/transactions'
import { currencyFormat } from '~~/helpers/formatting'
import ArrowUpIcon from '~~/components/icons/ArrowUpIcon.vue'
import ArrowDownIcon from '~~/components/icons/ArrowDownIcon.vue'
import { IBudget } from '~~/types/budget'

const emit = defineEmits(['onEdit'])

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const props = defineProps<{ budget: IBudget }>()

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()

const expanded = ref(false)

const balance = computed(() => {
  const transactionsWithCategory = transactionStore.transactionsWithCategory(
    props.budget.categoryIds
  )
  return totalAmountTransactions(transactionsWithCategory) as number
})

const balanceWithCurrency = computed(() => {
  return currencyFormat({
    value: balance.value,
    currency: userSettingStore.currency,
  })
})

const amountWithCurrency = computed(() => {
  return currencyFormat({
    value: props.amount,
    currency: userSettingStore.currency,
  })
})

const dailySpend = computed(() => {
  const current = props.budget.amount - balance.value
  const value = spendPerDay({
    balance: current,
    date: new Date(props.budget.endDate),
  })

  return currencyFormat({ value, currency: userSettingStore.currency })
})

const weeklySpend = computed(() => {
  const current = props.budget.amount - balance.value
  const value = spendPerWeek({
    balance: current,
    date: new Date(props.budget.endDate),
  })

  return currencyFormat({ value, currency: userSettingStore.currency })
})

const savePerMonth = computed(() => {
  const value = spendPerMonth({
    balance: props.amount,
    date: new Date(props.date),
  })

  return currencyFormat({ value, currency: userSettingStore.currency })
})
</script>
