<template>
  <div class="card-slim transaction-list-mobile">
    <Accordion
      v-for="[key, values] in Object.entries(groupedTransactions)"
      :key="key"
      :title="key"
    >
      <div class="transaction-list-mobile-accordion-content">
        <div
          v-for="{ id, type, account, name, category, amount, date } in values"
          :key="id"
          :class="accordionClassColor(type)"
        >
          <h3>{{ name }}</h3>
          <h3>
            {{
              currencyFormat({
                value: amount,
                currency: userSettingStore.currency,
              })
            }}
          </h3>
          <p>{{ type }}</p>
          <p>{{ account.name }}</p>
          <p>{{ category?.name }}</p>
          <small>{{ formatDate(new Date(date)) }}</small>
        </div>
      </div>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { groupBy, chain, zipObject } from 'lodash-es'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { formatDate } from '~~/helpers/dateTimeHelper'
import { ITransaction } from '~~/types/transaction'
import { currencyFormat } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'
import { UNCATEGORISED_CATEGORY, CATEGORY_ICONS } from '~~/constants/category'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER,
} from '~~/constants/transactions'

const props = defineProps({
  transactions: { type: Array<ITransaction>, default: [] },
})

const userSettingStore = useUserSettings()

const groupedTransactions = computed(() => {
  return groupBy(props.transactions, ({ date }) => {
    return date.split(' ')[0]
  })
})

const accordionClassColor = (transactionType: string) => {
  if (transactionType === TRANSACTION_TYPE_EXPENSE.displayName) {
    return 'transaction-list-mobile-accordion-content-item-expense'
  }
  if (transactionType === TRANSACTION_TYPE_INCOME.displayName) {
    return 'transaction-list-mobile-accordion-content-item-income'
  }
  if (transactionType === TRANSACTION_TYPE_TRANSFER.displayName) {
    return 'transaction-list-mobile-accordion-content-item-transfer'
  }
}
</script>

<style lang="scss">
@import './transactionList.scss';
</style>
