<template>
  <div class="card card-stretch">
    <table>
      <tr>
        <th>{{ TRANSACTION_COPY.date }}</th>
        <th>{{ TRANSACTION_COPY.name }}</th>
        <th>{{ TRANSACTION_COPY.category }}</th>
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
        <td>{{ name }}</td>
        <td>{{ category?.name }}</td>
        <td class="table-text-center">{{ type }}</td>
        <td class="table-text-center">{{ account.name }}</td>
        <td class="table-text-right">
          {{
            currencyFormat({ value: amount, currency: userSettings.currency })
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { TRANSACTION_COPY } from '~~/constants/copy'
import { formatDate } from '~~/helpers/dateTimeHelper'
import { ITransaction } from '~~/types/transaction'
import { currencyFormat } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'

const emit = defineEmits(['onEdit'])

const props = defineProps({
  transactions: { type: Array<ITransaction>, default: [] },
})

const userSettings = useUserSettings()

const onEdit = (transactionId: string) => {
  emit('onEdit', transactionId)
}
</script>
