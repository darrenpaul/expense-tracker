<template>
  <div class="transaction-list-mobile">
    <Accordion
      v-for="[key, values] in Object.entries(groupedTransactions)"
      :key="key"
      :title="key"
    >
      <div class="transaction-list-mobile-accordion-content">
        <button
          v-for="{ id, type, name, category, amount, date } in values"
          :key="id"
          type="button"
          class="transaction-list-mobile-accordion-content-button"
          @click="() => onEdit(id)"
        >
          <div class="transaction-list-mobile-accordion-content-item">
            <div class="text-left">
              <h3>{{ name }}</h3>
              <small>
                {{ formatDate(new Date(date)) }}
              </small>
            </div>

            <div class="text-right">
              <p>{{ category?.name }}</p>
              <h3>
                {{
                  addChangeSymbol({
                    value: currencyFormat({
                      value: amount,
                      currency: userSettingStore.currency,
                    }),
                    transactionType: type,
                  })
                }}
              </h3>
            </div>
          </div>
          <CaretRightIcon />
        </button>
      </div>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { groupBy } from 'lodash-es'
import { formatDate } from '~~/helpers/dateTimeHelper'
import { ITransaction } from '~~/types/transaction'
import { currencyFormat, addChangeSymbol } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'
import CaretRightIcon from '~~/components/icons/CaretRightIcon.vue'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER,
} from '~~/constants/transactions'
import { TRANSACTION_FORM_ROUTE } from '~~/constants/routes/transactions'
import { addQuery } from '~~/helpers/routerQuery'

const emit = defineEmits(['onEdit'])

const props = defineProps({
  transactions: { type: Array<ITransaction>, default: [] },
})

const userSettingStore = useUserSettings()

const groupedTransactions = computed(() => {
  return groupBy(props.transactions, ({ date }) => {
    return date.split(' ')[0]
  })
})

const onEdit = (transactionId: string) => {
  const transactionQuery = { [TRANSACTION_FORM_ROUTE.queryKey]: transactionId }
  addQuery(transactionQuery)
}
</script>

<style lang="scss">
@import './transactionList.scss';
</style>
