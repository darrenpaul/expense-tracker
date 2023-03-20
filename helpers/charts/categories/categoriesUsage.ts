import { ITransaction } from '~~/types/transaction'
import { totalAmountTransactions } from '~~/helpers/transactions'
import { UNCATEGORISED_CATEGORY } from '~~/constants/category'

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

  return {
    chartType: 'pie',
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      left: 'center',
      bottom: '5%',
      type: 'scroll',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          label: {
            show: false,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        label: {
          show: false,
        },
        data: seriesData,
      },
    ],
  }
}
