<template>
  <div>
    <h1>{{ TRANSACTION_COPY.transactions }}</h1>
    <table>
      <tr>
        <th>{{ TRANSACTION_COPY.note }}</th>
        <th>{{ TRANSACTION_COPY.amount }}</th>
        <th>{{ TRANSACTION_COPY.date }}</th>
        <th>{{ COMMON_COPY.actions }}</th>
      </tr>

      <tr v-for="{ id, note, amount, date } in transactions" :key="id">
        <td>{{ note }}</td>
        <td>{{ amount }}</td>
        <td>{{ formatDate(new Date(date)) }}</td>
        <td><button :value="id" @click="onDelete">Delete</button></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { TRANSACTION_COPY, COMMON_COPY } from '~~/constants/copy'
import { formatDate } from '~~/helpers/dateTimeHelper'
import { ITransaction } from '~~/types/transaction'
import { deleteTransaction } from '~~/endpoints/transaction'

const emit = defineEmits(['change'])

const props = defineProps({
  transactions: { type: Array<ITransaction>, default: [] },
})

const onDelete = async (event: Event) => {
  event.preventDefault()
  const transactionId = event?.target?.value as string

  await deleteTransaction(transactionId)
  alert('deleted transaction')
  emit('change')
}
</script>
