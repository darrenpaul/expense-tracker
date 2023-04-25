import {
  createPieSeriesObject,
  pieChartBaseOptions,
} from '../options/pieChartOptions'
import { ITransaction } from '~~/types/transaction'
import { mergeTransactionsByProperty } from '~~/helpers/transactions'
import { TRANSACTION_COPY } from '~~/constants/copy'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'
import { currencyFormat } from '~~/helpers/formatting'

export default (transactions: Array<ITransaction>, currency: string) => {
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

  const options = {
    ...pieChartBaseOptions,
    series: [createPieSeriesObject(seriesData)],
    title: {
      text: TRANSACTION_COPY.expensesVsIncomes,
    },
  }

  options.tooltip.valueFormatter = (value: number) =>
    currencyFormat({ value, currency })

  return options
}
