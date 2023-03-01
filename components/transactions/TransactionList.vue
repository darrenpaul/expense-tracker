<template>
  <table>
    <tr>
      <th>{{ TRANSACTION_COPY.transactionType }}</th>
      <th>{{ TRANSACTION_COPY.name }}</th>
      <th>{{ TRANSACTION_COPY.category }}</th>
      <th>{{ TRANSACTION_COPY.amount }}</th>
      <th>{{ TRANSACTION_COPY.date }}</th>
      <th>{{ COMMON_COPY.actions }}</th>
    </tr>

    <tr
      v-for="{
        id,
        type,
        name,
        category,
        amount,
        currency,
        date,
      } in transactions"
      :key="id"
    >
      <td>{{ type }}</td>
      <td>{{ name }}</td>
      <td>{{ category.name }}</td>
      <td>
        <b>{{ amount }}</b
        >{{ currency }}
      </td>
      <td>{{ formatDate(new Date(date)) }}</td>
      <td>
        <button :value="id" @click="onEdit">{{ COMMON_COPY.edit }}</button>
      </td>
      <td>
        <button :value="id" @click="onDelete">{{ COMMON_COPY.delete }}</button>
      </td>
    </tr>
  </table>
</template>

<script setup lang="ts">
import { TRANSACTION_COPY, COMMON_COPY } from '~~/constants/copy'
import { formatDate } from '~~/helpers/dateTimeHelper'
import { ITransaction } from '~~/types/transaction'
import { deleteTransaction } from '~~/endpoints/transaction'

const emit = defineEmits(['change', 'onEdit'])

const props = defineProps({
  transactions: { type: Array<ITransaction>, default: [] },
})
const onEdit = (event: Event) => {
  event.preventDefault()
  const transactionId = event?.target?.value as string

  emit('onEdit', transactionId)
}
const onDelete = async (event: Event) => {
  event.preventDefault()
  const transactionId = event?.target?.value as string

  await deleteTransaction(transactionId)
  alert('deleted transaction')
  emit('change')
}
</script>
