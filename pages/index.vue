<template>
  <div>
    <Chart :options="chartOptions" />
    <TransactionForm @change="refreshData" />
    <TransactionList
      v-if="transactions"
      :transactions="transactions"
      @change="refreshData"
    />
    <CategoryForm />
  </div>
</template>

<script setup lang="ts">
import TransactionForm from '~~/components/transactions/TransactionForm.vue'
import TransactionList from '~~/components/transactions/TransactionList.vue'
import CategoryForm from '~~/components/CategoryForm/index.vue'
import { viewTransactions } from '~~/endpoints/transaction'
import Chart from '~~/components/Chart.vue'

const { data: transactions, refresh } = await useAsyncData('transactions', () =>
  viewTransactions()
)

interface ITransactionItem {
  type: string
  date: string
  amount: number
}
const addSameDayTransactions = (list: Array<ITransactionItem>) => {
  const transaction: ITransactionItem = {
    type: '',
    date: '',
    amount: 0,
  }

  list.forEach(({ type, date, amount }: ITransactionItem) => {
    transaction.type = type
    transaction.date = date
    transaction.amount = parseFloat(amount) + parseFloat(transaction.amount)
  })
  return transaction
}

const combineSameDayTransactions = (list: Array) => {
  const dates: Array<string> = []
  const combined: Array<{ type: string; date: string; amount: number }> = []

  list.forEach(({ date }: { date: string }) => {
    if (dates.includes(date) === false) {
      dates.push(date)
      const sameDayTransactions = list.filter(
        (item: ITransactionItem) => item.date === date
      )
      combined.push(addSameDayTransactions(sameDayTransactions))
    }
  })
  return combined
}

const chartOptions = computed(() => {
  if (transactions.value?.length === 0) {
    return {}
  }

  const xAxisData = [...new Set(transactions.value?.map(({ date }) => date))]
  const seriesData = combineSameDayTransactions(transactions.value).map(
    ({ amount }) => amount
  )

  return {
    title: {
      text: 'Transactions',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Expenses'],
      top: 'bottom',
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Expenses',
        data: seriesData,
        type: 'line',
      },
    ],
  }
})

definePageMeta({
  middleware: process.client ? 'auth' : undefined,
})

const refreshData = () => {
  refresh()
}
</script>
