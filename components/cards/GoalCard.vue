<template>
  <div class="card card-stretch">
    <div class="row centered between mb-2">
      <h3>
        {{ name }}
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
      <button class="button-secondary" @click="emit('onEdit', goalId)">
        {{ COMMON_COPY.edit }}
      </button>

      <div class="grid grid-cols-2">
        <p>{{ COMMON_COPY.targetDate }}:</p>
        <p class="text-right">{{ formatDate(new Date(date)) }}</p>
      </div>

      <div class="grid grid-cols-2">
        <p>{{ COMMON_COPY.saveDaily }}</p>
        <p class="text-right">{{ savePerDay }}</p>
      </div>

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
      </div>
    </template>

    <ProgressBar :current-amount="balance" :max-amount="amount" />
  </div>
</template>

<script setup lang="ts">
import { COMMON_COPY } from '~~/constants/copy'
import { useUserSettings } from '~~/stores/userSettings'
import { useTransactions } from '~~/stores/transactions'
import ProgressBar from '~~/components/progressBars/ProgressBar.vue'
import { formatDate } from '~~/helpers/dateTimeHelper'
import {
  spendPerDay,
  spendPerWeek,
  spendPerMonth,
} from '~~/helpers/transactions'
import { currencyFormat } from '~~/helpers/formatting'
import ArrowUpIcon from '~~/components/icons/ArrowUpIcon.vue'
import ArrowDownIcon from '~~/components/icons/ArrowDownIcon.vue'

const emit = defineEmits(['onEdit'])

const props = defineProps({
  goalId: { type: String, required: true },
  accountId: { type: String, required: true },
  name: { type: String, default: '' },
  date: { type: String, default: '' },
  amount: { type: Number, default: 0 },
})

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()

const expanded = ref(false)

const balance = computed(() => {
  return transactionStore.transactionsForGoal(props.accountId)
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

const savePerDay = computed(() => {
  const value = spendPerDay({
    balance: props.amount,
    endDate: new Date(props.date),
  })

  return currencyFormat({ value, currency: userSettingStore.currency })
})

const savePerWeek = computed(() => {
  const value = spendPerWeek({
    balance: props.amount,
    endDate: new Date(props.date),
  })

  return currencyFormat({ value, currency: userSettingStore.currency })
})

const savePerMonth = computed(() => {
  const value = spendPerMonth({
    balance: props.amount,
    endDate: new Date(props.date),
  })

  return currencyFormat({ value, currency: userSettingStore.currency })
})
</script>
