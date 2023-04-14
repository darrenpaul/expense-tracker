import dayChart from './transactionsForPeriod/day'
import weekMonthChart from './transactionsForPeriod/weekMonth'
import infinityChart from './transactionsForPeriod/infinity'
import { ITransaction } from '~~/types/transaction'
import { balance } from '~~/helpers/transactions'
import { PERIODS } from '~~/helpers/dateFnsWrapper'

interface IParams {
  transactions: Array<ITransaction>
  date: Date
  period: string
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
  if (period === PERIODS.day.displayName) {
    return dayChart({
      transactions,
      date,
      period,
      currency,
    })
  }

  const accountBalance = balance()

  if (period === PERIODS.infinity.displayName) {
    return infinityChart({
      transactions,
      date,
      period,
      balance: accountBalance,
      currency,
    })
  }
  return weekMonthChart({
    transactions,
    date,
    period,
    balance: accountBalance,
    currency,
  })
}
