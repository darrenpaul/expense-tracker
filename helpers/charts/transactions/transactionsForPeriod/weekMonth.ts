import { format } from 'date-fns'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { currencyFormat } from '~~/helpers/formatting'
import {
  fillPeriodDays,
  mergeTransactionsByDate,
  spendPerDay,
  spendPerWeek,
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
import { PERIODS, daysOfMonth, daysOfWeek } from '~~/helpers/dateFnsWrapper'

const dayIntervals = ({ date, period }: { date: Date; period: string }) => {
  if (period === PERIODS.day.displayName) {
    return []
  }
  if (period === PERIODS.week.displayName) {
    return daysOfWeek(date)
  }
  if (period === PERIODS.month.displayName) {
    return daysOfMonth(date)
  }

  if (period === PERIODS.infinity.displayName) {
    return daysOfMonth(date)
  }
  return []
}

interface IWeekMonthInfinityPeriodChart {
  transactions: Array<ITransaction>
  date: Date
  period: string
  balance: number
  currency: string
}

export default ({
  transactions,
  date,
  period,
  balance,
  currency,
}: IWeekMonthInfinityPeriodChart) => {
  const days = dayIntervals({ date: new Date(), period })
  const expensesOnly = transactions.filter(
    ({ type }) => type === TRANSACTION_TYPE_EXPENSE.displayName
  )
  const incomesOnly = transactions.filter(
    ({ type }) => type === TRANSACTION_TYPE_INCOME.displayName
  )

  const expenses = mergeTransactionsByDate(expensesOnly)
  const incomes = mergeTransactionsByDate(incomesOnly)

  const expenseSeriesData = fillPeriodDays({
    transactions: expenses,
    days,
  }).map((expense) => expense?.amount)

  const incomeSeriesData = fillPeriodDays({ transactions: incomes, days }).map(
    (income) => income?.amount
  )

  const stringDays = days.map((day) => format(day, DATE_FORMAT))

  const spendPerDayValues: Array<number> = []
  const spendPerWeekValues: Array<number> = []

  const spendPerDayValue = spendPerDay({ balance, endDate: date })
  const spendPerWeekValue = spendPerWeek({ balance, endDate: date })

  days.forEach((day) => {
    spendPerDayValues.push(spendPerDayValue)
  })

  days.forEach((day) => {
    spendPerWeekValues.push(spendPerWeekValue)
  })

  const seriesData = [
    createBarSeriesObject({
      data: incomeSeriesData,
      name: TRANSACTION_TYPE_INCOME.displayName,
    }),
    createBarSeriesObject({
      data: expenseSeriesData,
      name: TRANSACTION_TYPE_EXPENSE.displayName,
    }),
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
