<template>
  <div class="transaction-list-container">
    <div class="transaction-list-desktop">
      <div class="card card-stretch">
        <table>
          <tr>
            <th>{{ TRANSACTION_COPY.date }}</th>
            <th>{{ TRANSACTION_COPY.name }}</th>
            <th class="table-text-center">
              {{ TRANSACTION_COPY.transactionType }}
            </th>
            <th class="table-text-center">
              {{ TRANSACTION_COPY.account }}
            </th>
            <th class="table-text-right">{{ TRANSACTION_COPY.amount }}</th>
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
            <td>{{ formatDate(new Date(date)) }}</td>
            <td class="flex items-center gap-4">
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
            <td class="table-text-center">{{ type }}</td>
            <td class="table-text-center">{{ account.name }}</td>
            <td class="table-text-right">
              {{
                currencyFormat({
                  value: amount,
                  currency: userSettings.currency,
                })
              }}
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div class="transaction-list-mobile">
      <div class="flex flex-col gap-4">
        <div
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
          class="card"
        >
          <div class="flex justify-between">
            <h3>{{ name }}</h3>
            <small>{{ formatDate(new Date(date)) }}</small>
          </div>
          <p>{{ type }}</p>
          <p>{{ account.name }}</p>
          <p>{{ category?.name }}</p>
          <p>
            {{
              currencyFormat({ value: amount, currency: userSettings.currency })
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
