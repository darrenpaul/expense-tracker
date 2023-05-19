import {
  eachDayOfInterval,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isToday,
  isWithinInterval,
  previousMonday,
  previousSunday,
  startOfWeek,
  subDays,
} from 'date-fns'
import {
  createLineSeriesObject,
  createLineXAxisObject,
  lineChartBaseOptions,
} from '../options/lineChartOptions'
import { ITransaction } from '~~/types/transaction'
import {
  fillPeriodDaysV2,
  mergeTransactionsByDate,
  mergeTransactionsByProperty,
} from '~~/helpers/transactions'
import { TRANSACTION_COPY } from '~~/constants/copy'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'
import { currencyFormat } from '~~/helpers/formatting'

export default (transactions: Array<ITransaction>, currency: string) => {
  const expenses = mergeTransactionsByDate(transactions)
  console.log('expenses:', expenses)

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

  const previousWeekStart = previousMonday(weekStart)
  const previousWeekEnd = previousSunday(weekStart)

  const previousWeek = expenses.filter(
    (transaction) =>
      isWithinInterval(new Date(transaction.date), {
        start: previousWeekStart,
        end: previousWeekEnd,
      }) ||
      isSameDay(previousWeekStart, new Date(transaction.date)) ||
      isSameDay(previousWeekEnd, new Date(transaction.date))
  )

  const currentWeek = expenses.filter(
    (transaction) =>
      isWithinInterval(new Date(transaction.date), {
        start: weekStart,
        end: weekEnd,
      }) ||
      isSameDay(weekStart, new Date(transaction.date)) ||
      isSameDay(weekEnd, new Date(transaction.date))
  )

  const previousWeek7Dates = eachDayOfInterval({
    start: previousWeekStart,
    end: previousWeekEnd,
  })

  const past7Dates = eachDayOfInterval({
    start: weekStart,
    end: new Date(),
  })

  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  })

  const previousWeekExpenses = fillPeriodDaysV2({
    transactions: previousWeek,
    days: previousWeek7Dates,
  })

  const past7Days = fillPeriodDaysV2({
    transactions: currentWeek,
    days: past7Dates,
  })

  const xAxisData = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

  const previousSeriesData = previousWeekExpenses.map(({ amount }) => amount)
  const seriesData = past7Days.map(({ amount }) => amount)

  const options = {
    ...lineChartBaseOptions,
    xAxis: [createLineXAxisObject(xAxisData)],
    series: [
      createLineSeriesObject({
        name: 'Current Week',
        data: seriesData,
        markLine: {
          symbol: 'pin',
          symbolSize: 30,
          data: [
            {
              name: 'Today',
              xAxis: xAxisData.indexOf(format(new Date(), 'EEEE')),
              label: {
                formatter: () => '',
              },
              symbol: 'none',
            },
          ],
        },
      }),
      createLineSeriesObject({
        name: 'Previous Week',
        data: previousSeriesData,
        lineStyle: { width: 2, type: 'dotted' },
      }),
    ],
    title: {
      text: 'Spending Trend (Week)',
      top: '3%',
      left: 'center',
    },
  }

  options.tooltip.valueFormatter = (value: number) =>
    currencyFormat({ value, currency })

  return options
}
