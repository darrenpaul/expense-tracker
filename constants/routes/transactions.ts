import TransactionIcon from '~~/components/icons/TransactionIcon.vue'

export const TRANSACTIONS_ROUTE = {
  name: 'transactions',
  displayName: 'Transactions',
  path: '/dashboard/transactions',
  auth: true,
  icon: TransactionIcon,
}
