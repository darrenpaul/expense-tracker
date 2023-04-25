import {
  createPieSeriesObject,
  pieChartBaseOptions,
} from '../options/pieChartOptions'
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

    groupedById[key].value.push(
      totalAmountTransactions(transactionsForCategory)
    )
  })

  const seriesData = Object.values(groupedById)
  const options = {
    ...pieChartBaseOptions,
    series: [createPieSeriesObject(seriesData)],
    title: {
      text: 'Category Usage',
    },
  }

  const currency = useUserSettings().currency
  options.tooltip.valueFormatter = (value: number) =>
    currencyFormat({ value, currency })

  return options
}
