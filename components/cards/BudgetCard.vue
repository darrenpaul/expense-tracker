<template>
  <div class="card card-stretch">
    <!-- HEADING -->
    <div
      class="flex items-center justify-between mb-2"
      @click="expanded = !expanded"
    >
      <h3>
        {{ budget.name }}
      </h3>

      <h4 v-if="budgetComplete">{{ COPY.complete }}</h4>

      <ArrowDownIcon v-if="expanded" size="14" />
      <ArrowUpIcon v-else size="14" />
    </div>

    <!-- DETAILS -->
    <template v-if="expanded">
      <div v-if="budgetComplete === true" class="flex gap-4">
        <button class="button-warn" @click="onDeleteBudget">
          {{ COPY.delete }}
        </button>

        <button
          v-if="budgetComplete === true"
          class="button"
          @click="onRecreateBudget"
        >
          {{ COPY.recreate }}
        </button>
      </div>

      <!-- EDIT BUDGET BUTTON -->
      <button
        v-else
        class="button-secondary"
        @click="emit('onEdit', budget.id)"
      >
        {{ COPY.edit }}
      </button>

      <div>
        <div class="grid grid-cols-2">
          <p>{{ COPY.balance }}</p>
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

        <div class="grid grid-cols-2">
          <p>{{ COPY.spendLimit }}</p>
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

      <div class="divider-h" />

      <!-- PERIOD -->
      <div class="grid grid-cols-2">
        <p>{{ COPY.spendingPeriod }}</p>
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
        <p>{{ COPY.daysRemaining }}</p>
        <p class="text-right">
          {{ daysRemaining }}
        </p>
      </div>

      <div class="divider-h" />

      <div v-if="budgetComplete" class="mb-2">
        <div class="grid grid-cols-2">
          <p>{{ COPY.dailySpendAmount }}</p>
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
          <p>{{ COPY.weeklySpendAmount }}</p>
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

      <div v-if="budgetComplete === false" class="mb-2">
        <div class="grid grid-cols-2">
          <p>{{ COPY.dailySpendLimit }}</p>
          <p class="text-right">{{ dailySpend }}</p>
        </div>

        <div class="grid grid-cols-2">
          <p>{{ COPY.weeklySpendLimit }}</p>
          <p class="text-right">{{ weeklySpend }}</p>
        </div>
      </div>
    </template>

    <ProgressBar
      :current-amount="balance"
      :max-amount="budget.amount"
      :hide-inner-text="false"
      :show-percentage="false"
      :progress-bar-color="progressBarBackgroundColor"
    />
  </div>
</template>

<script setup lang="ts">
import {
  isAfter,
  differenceInDays,
  isWithinInterval,
  differenceInWeeks,
  addDays,
  format,
  startOfDay,
  endOfDay,
} from 'date-fns'
import COPY from '~~/constants/copy/budget'
import { useUserSettings } from '~~/stores/userSettings'
import { useTransactions } from '~~/stores/transactions'
import ProgressBar from '~~/components/ProgressBar/index.vue'
import {
  DATE_TIME_FORMAT,
  formatDateToDisplay,
} from '~~/helpers/dateTimeHelper'
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
import { useBudgets } from '~~/stores/budgets'

const emit = defineEmits(['onEdit'])

const props = defineProps<{ budget: IBudget }>()

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()
const budgetStore = useBudgets()

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

const daysRemaining = computed(() => {
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

const budgetOverLimit = computed(() => {
  const { amount } = props.budget
  if (balance.value > amount) return true
  return false
})

const progressBarBackgroundColor = computed(() => {
  if (budgetOverLimit.value === true) return 'bg-red-500'
  return 'bg-primary'
})

const onDeleteBudget = () => {
  const { id } = props.budget
  budgetStore.handleDeleteBudget(id)
}

const onRecreateBudget = () => {
  const {
    id,
    categoryIds,
    name,
    amount,
    startDate,
    endDate,
    note,
    adjustBalance,
  } = props.budget

  const startDateObj = new Date(startDate)
  const endDateObj = new Date(endDate)

  const budgetLength = differenceInDays(endDateObj, startDateObj) as number

  const newStartDate = format(startOfDay(endDateObj), DATE_TIME_FORMAT)
  const newEndDate = format(
    addDays(endOfDay(endDateObj), budgetLength),
    DATE_TIME_FORMAT
  )

  const newBudgetData = {
    id,
    categoryIds,
    name,
    amount,
    startDate: newStartDate,
    endDate: newEndDate,
    note,
    adjustBalance,
  } as IBudget

  budgetStore.handleUpdateBudget(newBudgetData)
}
</script>
