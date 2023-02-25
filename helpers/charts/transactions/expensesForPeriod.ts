import { format, isSameDay, isSameMonth, isSameWeek } from 'date-fns'
import { ITransaction } from '~~/types/transaction'
import {
  mergeTransactionsByDate,
  mergeTransactionsByProperty,
  mergeExpensesByCategory,
  fillPeriodDays,
} from '~~/helpers/transactions'
import { PERIODS, daysOfWeek, daysOfMonth } from '~~/helpers/dateFnsWrapper'
import { DATE_FORMAT } from '~~/helpers/dateTimeHelper'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { TRANSACTION_TYPE_EXPENSE } from '~~/constants/transactions'

interface IParams {
  transactions: Array<ITransaction>
  date: Date
  period: string
}

const filterTransactionByPeriod = ({
  transactions,
  date,
  period,
}: IParams): Array<ITransaction> => {
  if (period === PERIODS.day.displayName) {
    return transactions.filter(({ date: itemDate }) =>
      isSameDay(new Date(date), new Date(itemDate))
    )
  }
  if (period === PERIODS.week.displayName) {
    return transactions.filter(({ date: itemDate }) =>
      isSameWeek(new Date(date), new Date(itemDate))
    )
  }
  if (period === PERIODS.month.displayName) {
    return transactions.filter(({ date: itemDate }) =>
      isSameMonth(new Date(date), new Date(itemDate))
    )
  }
  return []
}

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
  return []
}

const dayPeriodChart = ({ transactions, date, period }: IParams) => {
  const seriesData = mergeExpensesByCategory(transactions).map(
    ({ amount: value, category }) => ({ name: category?.displayName, value })
  )
  console.log('dayPeriodChart ~ seriesData:', seriesData)

  return {
    chartType: 'pie',
    title: {
      text: TRANSACTION_COPY.expensesForPeriod,
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

const weekMonthPeriodChart = ({ transactions, date, period }: IParams) => {
  const days = dayIntervals({ date, period })

  const expenses = mergeTransactionsByDate(transactions)
  const seriesData = fillPeriodDays({ transactions: expenses, days }).map(
    (expense) => expense?.amount || NaN
  )
  const stringDays = days.map((day) => format(day, DATE_FORMAT))

  return {
    chartType: 'bar',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: stringDays,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: seriesData,
      },
    ],
  }
}

export default ({ transactions, date, period }: IParams) => {
  const periodTransactions = filterTransactionByPeriod({
    transactions,
    date,
    period,
  })

  const expenses = periodTransactions.filter(
    ({ type }) => type === TRANSACTION_TYPE_EXPENSE.displayName
  )

  if (period === PERIODS.day.displayName) {
    return dayPeriodChart({ transactions: expenses, date, period })
  }

  return weekMonthPeriodChart({
    transactions: expenses,
    date,
    period,
  })
}
