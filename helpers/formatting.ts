import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'

interface ICurrencyFormatParams {
  value: number
  currency: string
}
export const currencyFormat = ({ value, currency }: ICurrencyFormatParams) => {
  console.log(value)
  if (!value) return '-'
  const valueFormatted = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  return `${currency} ${valueFormatted}`
}

interface IAddChangeSymbolParams {
  value: string
  transactionType: string
}
export const addChangeSymbol = ({
  value,
  transactionType,
}: IAddChangeSymbolParams) => {
  let symbol = ''
  if (transactionType === TRANSACTION_TYPE_EXPENSE.displayName) {
    symbol = '-'
  }
  if (transactionType === TRANSACTION_TYPE_INCOME.displayName) {
    symbol = '+'
  }
  return `${symbol} ${value}`
}
