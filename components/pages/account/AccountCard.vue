<template>
  <div class="card card-stretch account-card">
    <div class="account-card-title-amount-group">
      <h3 class="truncate">{{ account.name }}</h3>

      <h3>
        <b>
          {{
            currencyFormat({
              value: currentBalance,
              currency: userSettingStore.currency,
            })
          }}
        </b>
      </h3>
    </div>

    <div class="account-card-expense-income-group">
      <div class="pr-4 text-left">
        <p class="text-app-green">{{ COPY.totalIncome }}</p>
        <p class="text-app-green">
          <b>{{ totalIncomeCurrency }}</b>
        </p>
      </div>

      <div class="pl-4 text-right">
        <p class="text-app-red">{{ COPY.totalExpense }}</p>
        <p class="text-app-red">
          <b>{{ totalExpenseCurrency }}</b>
        </p>
      </div>
    </div>

    <div class="account-card-button-group">
      <button class="button-secondary" @click="onDelete">
        <TrashIcon fill="var(--primary)" :size="'14'" />
        {{ COPY.delete }}
        <span />
      </button>

      <button class="button" @click="onEdit">
        <PencilIcon :size="'14'" />
        {{ COPY.edit }}
        <span />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { currencyFormat } from '~~/helpers/formatting'
import PencilIcon from '~~/components/icons/PencilIcon.vue'
import TrashIcon from '~~/components/icons/TrashIcon.vue'
import { IAccount } from '~~/types/account'
import { useUserSettings } from '~~/stores/userSettings'
import { useTransactions } from '~~/stores/transactions'
import COPY from '~~/constants/copy/account'
import { addQuery } from '~~/helpers/routerQuery'
import { ACCOUNT_FORM_ROUTE } from '~~/constants/routes/accounts'

const emit = defineEmits(['onEdit', 'onDelete'])

const props = defineProps<{ account: IAccount }>()

const userSettingStore = useUserSettings()
const transactionStore = useTransactions()

const totalExpense = computed(() => {
  return transactionStore.expenseV2([props.account.id])
})

const totalIncome = computed(() => {
  return transactionStore.incomeV2([props.account.id])
})

const currentBalance = computed(() => {
  return totalIncome.value - totalExpense.value
})

const totalExpenseCurrency = computed(() => {
  return currencyFormat({
    value: totalExpense.value,
    currency: userSettingStore.currency,
  })
})

const totalIncomeCurrency = computed(() => {
  return currencyFormat({
    value: totalIncome.value,
    currency: userSettingStore.currency,
  })
})

const onEdit = () => {
  const accountQuery = { [ACCOUNT_FORM_ROUTE.queryKey]: props.account.id }
  addQuery(accountQuery)
}

const onDelete = () => {
  emit('onDelete', props.account.id)
}
</script>

<style lang="scss">
@import './cards.scss';
</style>
