import { TRANSACTION_COPY } from '~~/constants/copy'
import { currencyFormat } from '~~/helpers/formatting'
import { mergeExpensesByCategory } from '~~/helpers/transactions'
import { ITransaction } from '~~/types/transaction'

import {
  createPieSeriesObject,
  pieChartBaseOptions,
} from '~~/helpers/charts/options/pieChartOptions'

interface IDayPeriodChart {
  transactions: Array<ITransaction>
  date: Date
  period: string
  currency: string
}

export default ({ transactions, currency }: IDayPeriodChart) => {
  const seriesData = mergeExpensesByCategory(transactions).map(
    ({ amount: value, category }) => ({ name: category?.name, value })
  )

  const options = {
    ...pieChartBaseOptions,
    series: [createPieSeriesObject(seriesData)],
  }

  options.title.text = TRANSACTION_COPY.transactionsForPeriod
  options.tooltip.valueFormatter = (value: number) =>
    currencyFormat({ value, currency })

  return options
}
