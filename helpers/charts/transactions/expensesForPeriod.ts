import { format, isSameDay, isSameMonth, isSameWeek } from 'date-fns'
import { ITransaction } from '~~/types/transaction'
import {
  mergeTransactionsByDate,
  mergeExpensesByCategory,
  fillPeriodDays,
  balanceIncomeExpense,
  spendPerDay,
} from '~~/helpers/transactions'
import {
  PERIODS,
  daysOfWeek,
  daysOfMonth,
  inSameWeek,
} from '~~/helpers/dateFnsWrapper'
import { DATE_FORMAT, DATE_TIME_FORMAT } from '~~/helpers/dateTimeHelper'
import { TRANSACTION_COPY } from '~~/constants/copy'
import { TRANSACTION_TYPE_EXPENSE } from '~~/constants/transactions'
import { currencyFormat } from '~~/helpers/formatting'

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
    return transactions.filter(({ date: itemDate }) => {
      console.log(itemDate, format(date, DATE_TIME_FORMAT))
      console.log(date)
      console.log(new Date(itemDate))
      console.log(inSameWeek(date, new Date(itemDate)))
      return inSameWeek(date, new Date(itemDate))
    })
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

interface IDayPeriodChart extends IParams {
  currency: string
}
const dayPeriodChart = ({
  transactions,
  date,
  period,
  currency,
}: IDayPeriodChart) => {
  const seriesData = mergeExpensesByCategory(transactions).map(
    ({ amount: value, category }) => ({ name: category?.name, value })
  )

  return {
    chartType: 'pie',
    title: {
      text: TRANSACTION_COPY.expensesForPeriod,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      valueFormatter: (value: number) => currencyFormat({ value, currency }),
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

interface IWeekMonthPeriodChart extends IParams {
  balance: number
  currency: string
}
const weekMonthPeriodChart = ({
  transactions,
  date,
  period,
  balance,
  currency,
}: IWeekMonthPeriodChart) => {
  const days = dayIntervals({ date, period })

  const expenses = mergeTransactionsByDate(transactions)
  const seriesData = fillPeriodDays({ transactions: expenses, days }).map(
    (expense) => expense?.amount
  )
  const stringDays = days.map((day) => format(day, DATE_FORMAT))

  const recommendSpends: Array<number> = []

  const spendPerDayValue = spendPerDay({ balance, date })

  days.forEach((day) => {
    recommendSpends.push(spendPerDayValue)
  })

  return {
    chartType: 'line',
    title: {
      text: TRANSACTION_COPY.expensesForPeriod,
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      valueFormatter: (value: number) => currencyFormat({ value, currency }),
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
        name: TRANSACTION_TYPE_EXPENSE.displayName,
        type: 'line',
        data: seriesData,
      },
      {
        name: TRANSACTION_COPY.recommendedSpend,
        type: 'line',
        data: recommendSpends,
        symbol: 'none',
        lineStyle: { type: 'dotted' },
      },
    ],
  }
}

interface IExpensesForPeriod {
  transactions: Array<ITransaction>
  date: Date
  period: string
  currency: string
}
export default ({
  transactions,
  date,
  period,
  currency,
}: IExpensesForPeriod) => {
  const periodTransactions = filterTransactionByPeriod({
    transactions,
    date,
    period,
  })

  const expenses = periodTransactions.filter(
    ({ type }) => type === TRANSACTION_TYPE_EXPENSE.displayName
  )

  if (period === PERIODS.day.displayName) {
    return dayPeriodChart({ transactions: expenses, date, period, currency })
  }

  const { balance } = balanceIncomeExpense(transactions)

  return weekMonthPeriodChart({
    transactions: expenses,
    date,
    period,
    balance,
    currency,
  })
}
