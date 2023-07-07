import TransactionIcon from '~~/components/icons/TransactionIcon.vue'

export const TRANSACTIONS_ROUTE = {
  name: 'transactions',
  displayName: 'Transactions',
  path: 'transactions',
  auth: true,
  icon: TransactionIcon,
}

export const TRANSACTION_FORM_ROUTE = {
  name: 'transactionForm',
  displayName: 'Transaction Form',
  path: 'transactions',
  queryKey: 'transaction',
}
