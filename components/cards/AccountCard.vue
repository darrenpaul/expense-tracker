<template>
  <div class="card-dark card-stretch account-card">
    <div class="account-card-title-amount-group">
      <h3 class="truncate">{{ account.name }}</h3>

      <h3>
        {{
          currencyFormat({
            value: currentBalance,
            currency: userSettingStore.currency,
          })
        }}
      </h3>
    </div>

    <div class="account-card-progress-bar-actions-group">
      <ProgressBar
        :current-amount="totalExpense"
        :max-amount="totalIncome"
        :labels="[
          COPY.moneyOut,
          COPY.moneyIn,
          totalExpenseCurrency,
          totalIncomeCurrency,
        ]"
        :background-color="'bg-green-500'"
        :progress-bar-color="'bg-red-500'"
        :hide-inner-text="true"
        :show-percentage="true"
      />

      <div class="account-card-button-group">
        <button class="button-icon-secondary" @click="onDelete">
          <TrashIcon :fill="'var(--primary)'" />
        </button>

        <button class="button-icon" @click="onEdit"><PencilIcon /></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { min } from 'date-fns'
import ProgressBar from '~~/components/ProgressBar/index.vue'
import { currencyFormat } from '~~/helpers/formatting'
import PencilIcon from '~~/components/icons/PencilIcon.vue'
import TrashIcon from '~~/components/icons/TrashIcon.vue'
import { IAccount } from '~~/types/account'
import { useUserSettings } from '~~/stores/userSettings'
import { useTransactions } from '~~/stores/transactions'
import COPY from '~~/constants/copy/account'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'
import { sumArrayNumbers } from '~~/helpers/maths'

const emit = defineEmits(['onEdit', 'onDelete'])

const props = defineProps<{ account: IAccount }>()

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()

const currentBalance = computed(() => {
  return totalIncome.value - totalExpense.value
})

const totalExpense = computed(() => {
  return transactionStore.expense(
    props.account.id,
    props.account.includeInBalance
  )
})

const totalExpenseCurrency = computed(() => {
  return currencyFormat({
    value: totalExpense.value,
    currency: userSettingStore.currency,
  })
})

const totalIncome = computed(() => {
  return transactionStore.income(
    props.account.id,
    props.account.includeInBalance
  )
})

const totalIncomeCurrency = computed(() => {
  return currencyFormat({
    value: totalIncome.value,
    currency: userSettingStore.currency,
  })
})

const onEdit = () => {
  emit('onEdit', props.account.id)
}

const onDelete = () => {
  emit('onDelete', props.account.id)
}
</script>

<style lang="scss">
@import './cards.scss';
</style>
