import TransactionIcon from '~~/components/icons/TransactionIcon.vue'

export const TRANSACTIONS_ROUTE = {
  name: 'transactions',
  displayName: 'Transactions',
  path: '/dashboard/transactions',
  auth: true,
  icon: TransactionIcon,
}

export const TRANSACTION_FORM_ROUTE = {
  name: 'transactionForm',
  displayName: 'Transaction Form',
  path: '/dashboard/transactions',
  queryKey: 'transaction',
}
