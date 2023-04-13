<template>
  <div class="transaction-list-desktop">
    <div class="card-stretch">
      <p v-if="transactions.length === 0">
        {{ TRANSACTION_COPY.noTransactions }}
      </p>
      <table v-else class="w-full">
        <tr>
          <th v-if="canShowRow(TRANSACTION_COPY.date)">
            {{ TRANSACTION_COPY.date }}
          </th>
          <th v-if="canShowRow(TRANSACTION_COPY.name)">
            {{ TRANSACTION_COPY.name }}
          </th>
          <th
            v-if="canShowRow(TRANSACTION_COPY.transactionType)"
            class="table-text-center"
          >
            {{ TRANSACTION_COPY.transactionType }}
          </th>
          <th
            v-if="canShowRow(TRANSACTION_COPY.account)"
            class="table-text-center"
          >
            {{ TRANSACTION_COPY.account }}
          </th>
          <th
            v-if="canShowRow(TRANSACTION_COPY.amount)"
            class="table-text-right"
          >
            {{ TRANSACTION_COPY.amount }}
          </th>
        </tr>

        <tr
          v-for="{
            id,
            type,
            account,
            name,
            category,
            amount,
            date,
          } in transactions"
          :key="id"
          class="tr-highlight"
          @click="() => onEdit(id)"
        >
          <td v-if="canShowRow(TRANSACTION_COPY.date)">
            {{ formatDate(new Date(date)) }}
          </td>
          <td
            v-if="canShowRow(TRANSACTION_COPY.name)"
            class="flex items-center gap-4"
          >
            <template v-if="category">
              <template
                v-for="categoryIcon in CATEGORY_ICONS"
                :key="categoryIcon.label"
              >
                <component
                  :is="categoryIcon.component"
                  v-if="category.icon === categoryIcon.value"
                  :size="'32'"
                />
              </template>
            </template>
            {{ name }}
          </td>
          <td
            v-if="canShowRow(TRANSACTION_COPY.transactionType)"
            class="table-text-center"
          >
            {{ type }}
          </td>
          <td
            v-if="canShowRow(TRANSACTION_COPY.account)"
            class="table-text-center"
          >
            {{ account.name }}
          </td>
          <td
            v-if="canShowRow(TRANSACTION_COPY.amount)"
            class="table-text-right"
          >
            {{
              addChangeSymbol({
                value: currencyFormat({
                  value: amount,
                  currency: userSettingStore.currency,
                }),
                transactionType: type,
              })
            }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TRANSACTION_COPY } from '~~/constants/copy'
import { formatDate } from '~~/helpers/dateTimeHelper'
import { ITransaction } from '~~/types/transaction'
import { currencyFormat, addChangeSymbol } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'
import { CATEGORY_ICONS } from '~~/constants/category'

const emit = defineEmits(['onEdit'])

const props = defineProps({
  transactions: { type: Array<ITransaction>, default: [] },
  rows: {
    type: Array<string>,
    default: [],
  },
})

const userSettingStore = useUserSettings()

const canShowRow = (rowName: string) => {
  if (props.rows.includes(rowName)) return true
  return false
}

const onEdit = (transactionId: string) => {
  emit('onEdit', transactionId)
}
</script>

<style lang="scss">
@import './transactionList.scss';
</style>
