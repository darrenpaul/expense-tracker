import { format, isSameDay, isSameMonth } from 'date-fns'
import { ITransaction } from '~~/types/transaction'
import {
  mergeTransactionsByDate,
  mergeExpensesByCategory,
  fillPeriodDays,
  balanceIncomeExpense,
  spendPerDay,
  balance,
  spendPerWeek,
} from '~~/helpers/transactions'
import {
  PERIODS,
  daysOfWeek,
  daysOfMonth,
  inSameWeek,
} from '~~/helpers/dateFnsWrapper'
import { DATE_FORMAT } from '~~/helpers/dateTimeHelper'
import { TRANSACTION_COPY } from '~~/constants/copy'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'
import { currencyFormat } from '~~/helpers/formatting'
import { useAccounts } from '~~/stores/accounts'

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

  const spendPerDayValue = spendPerDay({ balance, date })
  const spendPerWeekValue = spendPerWeek({ balance, date })

  days.forEach((day) => {
    spendPerDayValues.push(spendPerDayValue)
  })

  days.forEach((day) => {
    spendPerWeekValues.push(spendPerWeekValue)
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
        type: 'bar',
        data: expenseSeriesData,
      },
      {
        name: TRANSACTION_TYPE_INCOME.displayName,
        type: 'bar',
        data: incomeSeriesData,
      },
      {
        name: TRANSACTION_COPY.spendPerDay,
        type: 'line',
        data: spendPerDayValues,
        symbol: 'none',
        lineStyle: { type: 'dotted' },
      },
      {
        name: TRANSACTION_COPY.spendPerWeek,
        type: 'line',
        data: spendPerWeekValues,
        symbol: 'none',
        lineStyle: { type: 'dotted' },
      },
    ],
  }
}

interface ITransactionsForPeriod {
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
}: ITransactionsForPeriod) => {
  const periodTransactions = filterTransactionByPeriod({
    transactions,
    date,
    period,
  })

  if (period === PERIODS.day.displayName) {
    return dayPeriodChart({
      transactions: periodTransactions,
      date,
      period,
      currency,
    })
  }

  const accountBalance = balance()

  return weekMonthPeriodChart({
    transactions: periodTransactions,
    date,
    period,
    balance: accountBalance,
    currency,
  })
}
