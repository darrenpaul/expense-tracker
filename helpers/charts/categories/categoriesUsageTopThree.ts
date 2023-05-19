import {
  createPieSeriesObject,
  pieChartBaseOptions,
} from '../options/pieChartOptions'
import { ITransaction } from '~~/types/transaction'
import { totalAmountTransactions } from '~~/helpers/transactions'
import { UNCATEGORISED_CATEGORY } from '~~/constants/category'
import { currencyFormat } from '~~/helpers/formatting'
import { useUserSettings } from '~~/stores/userSettings'

export default (transactions: Array<ITransaction>) => {
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
  // Convert the data object to an array of objects
  const dataArray = Object.entries(groupedById).map(([key, value]) => ({
    id: key,
    ...value,
  }))

  // Sort the array in descending order based on the "value" property
  dataArray.sort((a, b) => b.value - a.value)

  // Get the top three elements
  const topThree = dataArray.slice(0, 3)

  const seriesData = Object.values(topThree)
  const options = {
    ...pieChartBaseOptions,
    series: [createPieSeriesObject(seriesData)],
    title: {
      text: 'Top Expense\nCategories',
      subtext: 'For the current month',
      top: '36%',
      left: 'center',
    },
  }

  const currency = useUserSettings().currency
  options.tooltip.valueFormatter = (value: number) =>
    currencyFormat({ value, currency })

  return options
}
