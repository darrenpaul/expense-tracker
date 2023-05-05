<template>
  <div class="card card-stretch">
    <div class="row centered between mb-2">
      <h3>
        {{ budget.name }}
      </h3>

      <h4 v-if="budgetComplete">{{ COPY.complete }}</h4>

      <button
        class="button-icon-transparent z-50"
        @click="expanded = !expanded"
      >
        <ArrowDownIcon v-if="expanded" />
        <ArrowUpIcon v-else />
      </button>
    </div>

    <template v-if="expanded">
      <button
        v-if="budgetComplete === false"
        class="button-secondary"
        @click="emit('onEdit', budget.id)"
      >
        {{ COPY.edit }}
      </button>

      <!-- SPEND & SPENT -->
      <div>
        <!-- SPENT -->
        <div class="grid grid-cols-2">
          <p>{{ COPY.spent }}</p>
          <div>
            <p class="text-right">
              {{
                currencyFormat({
                  value: balance,
                  currency: userSettingStore.currency,
                })
              }}
            </p>
          </div>
        </div>

        <!-- SPEND -->
        <div class="grid grid-cols-2">
          <p>{{ COPY.spend }}</p>
          <div>
            <p class="text-right">
              {{
                currencyFormat({
                  value: budget.amount,
                  currency: userSettingStore.currency,
                })
              }}
            </p>
          </div>
        </div>
      </div>

      <div class="divider" />

      <!-- PERIOD -->
      <div class="grid grid-cols-2">
        <p>{{ COPY.period }}</p>
        <div>
          <p class="text-right">
            {{ formatDateToDisplay(new Date(budget.startDate)) }}
          </p>
          <p class="text-right">
            {{ formatDateToDisplay(new Date(budget.endDate)) }}
          </p>
        </div>
      </div>

      <!-- DAYS LEFT -->
      <div class="grid grid-cols-2">
        <p>{{ COPY.daysLeft }}</p>
        <p class="text-right">
          {{ daysLeft }}
        </p>
      </div>

      <div class="divider" />

      <div>
        <div class="grid grid-cols-2">
          <p>{{ COPY.spentPerDay }}</p>
          <p class="text-right">
            {{
              currencyFormat({
                value: dailySpent,
                currency: userSettingStore.currency,
              })
            }}
          </p>
        </div>

        <div class="grid grid-cols-2">
          <p>{{ COPY.spentPerWeek }}</p>
          <p class="text-right">
            {{
              currencyFormat({
                value: weeklySpent,
                currency: userSettingStore.currency,
              })
            }}
          </p>
        </div>
      </div>

      <div class="divider" />

      <div class="mb-2">
        <div class="grid grid-cols-2">
          <p>{{ COPY.spendPerDay }}</p>
          <p class="text-right">{{ dailySpend }}</p>
        </div>

        <div class="grid grid-cols-2">
          <p>{{ COPY.spendPerWeek }}</p>
          <p class="text-right">{{ weeklySpend }}</p>
        </div>
      </div>
    </template>

    <ProgressBar
      :current-amount="balance"
      :max-amount="budget.amount"
      :hide-inner-text="false"
      :show-percentage="false"
    />
  </div>
</template>

<script setup lang="ts">
import {
  isAfter,
  differenceInDays,
  isWithinInterval,
  differenceInWeeks,
} from 'date-fns'
import COPY from '~~/constants/copy/budget'
import { useUserSettings } from '~~/stores/userSettings'
import { useTransactions } from '~~/stores/transactions'
import ProgressBar from '~~/components/ProgressBar/index.vue'
import { formatDateToDisplay } from '~~/helpers/dateTimeHelper'
import {
  mergeTransactionsByDate,
  spendPerDay,
  spendPerWeek,
  totalAmountTransactions,
} from '~~/helpers/transactions'
import { currencyFormat } from '~~/helpers/formatting'
import ArrowUpIcon from '~~/components/icons/ArrowUpIcon.vue'
import ArrowDownIcon from '~~/components/icons/ArrowDownIcon.vue'
import { IBudget } from '~~/types/budget'
import { average } from '~~/helpers/maths'
import { ITransaction } from '~~/types/transaction'

const emit = defineEmits(['onEdit'])

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
  layout: 'main',
})

const props = defineProps<{ budget: IBudget }>()

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()

const expanded = ref(false)

const transactionsForPeriod = computed(() => {
  const { startDate, endDate } = props.budget
  const transactionsInPeriod = transactionStore.transactions.filter(
    (transaction) =>
      isWithinInterval(new Date(transaction.date), {
        start: new Date(startDate),
        end: new Date(endDate),
      })
  )
  const transactionsWithCategory = transactionsInPeriod.filter((transaction) =>
    props.budget.categoryIds.includes(transaction.category.id)
  )

  return transactionsWithCategory as Array<ITransaction>
})

const balance = computed(() => {
  return totalAmountTransactions(transactionsForPeriod.value) as number
})

const dailySpent = computed(() => {
  const mergedTransactions = mergeTransactionsByDate(
    transactionsForPeriod.value
  )

  const transactionAmounts = mergedTransactions.map(
    (transaction) => transaction.amount
  )

  const zeroAmountsForDays = new Array(amountOfDays.value).fill(0)

  const AmountsAndZeros = [...transactionAmounts, ...zeroAmountsForDays]

  AmountsAndZeros.splice(amountOfDays.value)

  return average({ values: AmountsAndZeros })
})

const weeklySpent = computed(() => {
  const mergedTransactions = mergeTransactionsByDate(
    transactionsForPeriod.value
  )

  const transactionAmounts = mergedTransactions.map(
    (transaction) => transaction.amount
  )

  const zeroAmountsForDays = new Array(amountOfDays.value).fill(0)

  const AmountsAndZeros = [...transactionAmounts, ...zeroAmountsForDays]

  AmountsAndZeros.splice(amountOfWeeks.value)

  return average({ values: AmountsAndZeros })
})

const dailySpend = computed(() => {
  const current = props.budget.amount - balance.value
  const value = spendPerDay({
    balance: current,
    endDate: new Date(props.budget.endDate),
  })

  return currencyFormat({ value, currency: userSettingStore.currency })
})

const weeklySpend = computed(() => {
  const current = props.budget.amount - balance.value
  const value = spendPerWeek({
    balance: current,
    endDate: new Date(props.budget.endDate),
  })

  return currencyFormat({ value, currency: userSettingStore.currency })
})

const budgetComplete = computed(() => {
  const { endDate } = props.budget
  const today = new Date()
  if (isAfter(today, new Date(endDate))) {
    return true
  }
  return false
})

const daysLeft = computed(() => {
  const { endDate } = props.budget
  const current = new Date()
  const end = new Date(endDate)
  const days = differenceInDays(end, current)
  if (days < 0) {
    return 0
  }
  return days
})

const amountOfDays = computed(() => {
  const { startDate, endDate } = props.budget
  const start = new Date(startDate)
  const end = new Date(endDate)
  return differenceInDays(end, start)
})

const amountOfWeeks = computed(() => {
  const { startDate, endDate } = props.budget
  const start = new Date(startDate)
  const end = new Date(endDate)
  return differenceInWeeks(end, start)
})
</script>
