<template>
  <div class="transaction-list-container">
    <TransactionListDesktop :transactions="props.transactions" />
    <TransactionListMobile :transactions="props.transactions" />
  </div>
</template>

<script setup lang="ts">
import TransactionListDesktop from './TransactionListDesktop.vue'
import TransactionListMobile from './TransactionListMobile.vue'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { formatDate } from '~~/helpers/dateTimeHelper'
import { ITransaction } from '~~/types/transaction'
import { currencyFormat } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'
import { UNCATEGORISED_CATEGORY, CATEGORY_ICONS } from '~~/constants/category'

const emit = defineEmits(['onEdit'])

const props = defineProps({
  transactions: { type: Array<ITransaction>, default: [] },
})

const userSettings = useUserSettings()

const onEdit = (transactionId: string) => {
  emit('onEdit', transactionId)
}
</script>

<style lang="scss">
@import './transactionList.scss';
</style>
