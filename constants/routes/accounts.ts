import AccountIcon from '~~/components/icons/mainNavigation/AccountIcon.vue'

export const ACCOUNTS_ROUTE = {
  name: 'accounts',
  displayName: 'Accounts',
  path: '/dashboard/accounts',
  auth: true,
  icon: AccountIcon,
}
