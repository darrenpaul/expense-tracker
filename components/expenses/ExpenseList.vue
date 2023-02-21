<template>
  <div>
    <h1>{{ EXPENSE_COPY.expenses }}</h1>
    <table>
      <tr>
        <th>{{ EXPENSE_COPY.note }}</th>
        <th>{{ EXPENSE_COPY.amount }}</th>
        <th>{{ EXPENSE_COPY.date }}</th>
        <th>{{ COMMON_COPY.actions }}</th>
      </tr>

      <tr v-for="{ id, note, amount, date } in expenses" :key="id">
        <td>{{ note }}</td>
        <td>{{ amount }}</td>
        <td>{{ formatDate(new Date(date)) }}</td>
        <td><button>Delete</button></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { EXPENSE_COPY, COMMON_COPY } from '~~/constants/copy'
import { formatDate } from '~~/helpers/dateTimeHelper'
import { IExpense } from '~~/types/expense'

const props = defineProps({
  expenses: { type: Array<IExpense>, default: [] },
})
</script>
