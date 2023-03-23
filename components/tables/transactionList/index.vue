<template>
  <div class="transaction-list-container">
    <TransactionListDesktop
      :transactions="props.transactions"
      :rows="props.rows"
      @on-edit="onEdit"
    />

    <TransactionListMobile
      :transactions="props.transactions"
      @on-edit="onEdit"
    />
  </div>
</template>

<script setup lang="ts">
import TransactionListDesktop from './TransactionListDesktop.vue'
import TransactionListMobile from './TransactionListMobile.vue'
import { ITransaction } from '~~/types/transaction'
import { TRANSACTION_COPY } from '~~/constants/copy'

const emit = defineEmits(['onEdit'])

const props = defineProps({
  transactions: { type: Array<ITransaction>, default: [] },
  rows: {
    type: Array<string>,
    default: [
      TRANSACTION_COPY.date,
      TRANSACTION_COPY.name,
      TRANSACTION_COPY.transactionType,
      TRANSACTION_COPY.account,
      TRANSACTION_COPY.amount,
    ],
  },
})

const onEdit = (transactionId: string) => {
  emit('onEdit', transactionId)
}
</script>

<style lang="scss">
@import './transactionList.scss';
</style>
