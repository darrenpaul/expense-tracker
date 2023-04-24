import { barChartBaseOptions } from '../options/barChartOptions'
import { chartEmphasisOptions } from '../options/emphasisOptions'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { ITransaction } from '~~/types/transaction'
import { totalAmountTransactions } from '~~/helpers/transactions'
import { UNCATEGORISED_CATEGORY } from '~~/constants/category'
import { currencyFormat } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'

export default (transactions: Array<ITransaction>, title: string) => {
  const categories = [...new Set(transactions.map(({ category }) => category))]

  const groupedById = {}
  categories.forEach((category) => {
    const transactionsForCategory = transactions.filter(
      ({ category: transactionCategory }) =>
        category?.id === transactionCategory?.id
    )

    const key = category?.id || 'undefined'
    if (!groupedById[key]) {
      groupedById[key] = {
        value: [],
        name: category?.name || UNCATEGORISED_CATEGORY,
      }
    }

    groupedById[key].value = totalAmountTransactions(transactionsForCategory)
  })

  const xAxisLabels = Object.values(groupedById).map(({ name }) => name)
  const seriesData = Object.values(groupedById).map(({ value }) => value)

  const options = {
    ...barChartBaseOptions,
    xAxis: {
      type: 'category',
      data: xAxisLabels,
      axisLabel: {
        rotate: 45,
      },
    },
    series: [
      {
        data: seriesData,
        itemStyle: {
          color: () => `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          borderRadius: [10, 10, 0, 0],
          borderWidth: 2,
        },
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
        emphasis: chartEmphasisOptions,
      },
    ],
  }

  options.title.text = TRANSACTION_COPY.transactionsForPeriod
  options.tooltip.valueFormatter = (value: number) =>
    currencyFormat({ value, currency: useUserSettings().currency })
  options.grid.bottom = '0%'

  return options
}
