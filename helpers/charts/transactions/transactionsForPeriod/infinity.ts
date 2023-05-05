import { format } from 'date-fns'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { currencyFormat } from '~~/helpers/formatting'
import {
  fillPeriodDays,
  mergeTransactionsByDate,
} from '~~/helpers/transactions'
import { ITransaction } from '~~/types/transaction'

import {
  createBarSeriesObject,
  barChartBaseOptions,
  createBarXAxisObject,
} from '~~/helpers/charts/options/barChartOptions'
import { DATE_FORMAT } from '~~/helpers/dateTimeHelper'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'
import { useTransactions } from '~~/stores/transactions'

interface IInfinityPeriodChart {
  transactions: Array<ITransaction>
  currency: string
}

export default ({ transactions, currency }: IInfinityPeriodChart) => {
  const expensesOnly = transactions.filter(
    ({ type }) => type === TRANSACTION_TYPE_EXPENSE.displayName
  )
  const incomesOnly = transactions.filter(
    ({ type }) => type === TRANSACTION_TYPE_INCOME.displayName
  )

  const expenses = mergeTransactionsByDate(expensesOnly).reverse()
  const incomes = mergeTransactionsByDate(incomesOnly).reverse()

  const expensesIncomes = [...expenses, ...incomes]
  const combinedDates = expensesIncomes.map(
    (transaction) => new Date(transaction.date)
  )

  const sortedDates = combinedDates.sort((a, b) => a - b)
  const stringDays = [
    ...new Set(sortedDates.map((date) => format(date, DATE_FORMAT))),
  ]

  const days = stringDays.map((date) => new Date(date))

  const expenseSeriesData = fillPeriodDays({
    transactions: expenses,
    days,
  }).map((expense) => expense?.amount)

  const incomeSeriesData = fillPeriodDays({
    transactions: incomes,
    days,
  }).map((income) => income?.amount)

  const seriesData = [
    createBarSeriesObject({
      data: incomeSeriesData,
      name: TRANSACTION_TYPE_INCOME.displayName,
    }),
    createBarSeriesObject({
      data: expenseSeriesData,
      name: TRANSACTION_TYPE_EXPENSE.displayName,
    }),
    // {
    //   name: 'Average Spend (Last Month)',
    //   type: 'line',
    //   showSymbol: false,
    //   data: averageApples,
    //   lineStyle: {
    //     normal: {
    //       type: 'dashed',
    //     },
    //   },
    // },
  ]

  const options = {
    ...barChartBaseOptions,
    xAxis: [createBarXAxisObject(stringDays)],
    series: seriesData,
  }

  options.title.text = TRANSACTION_COPY.transactionsForPeriod
  options.tooltip.valueFormatter = (value: number) =>
    currencyFormat({ value, currency })
  options.grid.bottom = '18%'

  return options
}
