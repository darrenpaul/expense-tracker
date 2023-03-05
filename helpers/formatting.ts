interface ICurrencyFormatParams {
  value: number
  currency: string
}
export const currencyFormat = ({ value, currency }: ICurrencyFormatParams) => {
  if (!value) return '-'
  const valueFormatted = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  return `${currency} ${valueFormatted}`
}
