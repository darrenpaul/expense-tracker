import { ITransaction } from '~~/types/transaction'
import { totalAmountTransactions } from '~~/helpers/transactions'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { useCategories } from '~~/stores/categories'

export default (transactions: Array<ITransaction>) => {
  const categoryStore = useCategories()
  const categories = categoryStore.categories

  const groupedById = {}
  categories.forEach(({ name, id }) => {
    const abc = transactions.filter(({ category }) => category?.name === name)

    const key = id || 'undefined'
    if (!groupedById[key]) {
      groupedById[key] = { value: [], name: '' }
    }

    groupedById[key].name = name
    groupedById[key].value.push(totalAmountTransactions(abc))
  })

  const seriesData = Object.values(groupedById)

  return {
    chartType: 'pie',
    title: {
      text: TRANSACTION_COPY.expensesVsIncomes,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      left: 'center',
      bottom: '5%',
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
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        data: seriesData,
      },
    ],
  }
}
