import { ITransaction } from '~~/types/transaction'
import { mergeTransactionsByProperty } from '~~/helpers/transactions'
import { TRANSACTION_COPY } from '~~/constants/copy'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'

export default (transactions: Array<ITransaction>) => {
  const expenses = mergeTransactionsByProperty({
    keyProperty: TRANSACTION_TYPE_EXPENSE.displayName,
    data: transactions,
  })
  const incomes = mergeTransactionsByProperty({
    keyProperty: TRANSACTION_TYPE_INCOME.displayName,
    data: transactions,
  })

  const seriesData = [expenses, incomes].map(({ amount, type }) => ({
    value: amount,
    name: type,
  }))

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
