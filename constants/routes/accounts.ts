import AccountIcon from '~~/components/icons/dashboardNavigation/AccountIcon.vue'

export const ACCOUNTS_ROUTE = {
  name: 'accounts',
  displayName: 'Accounts',
  path: '/dashboard/accounts',
  auth: true,
  icon: AccountIcon,
}

export const ACCOUNT_FORM_ROUTE = {
  name: 'accountForm',
  displayName: 'Account Form',
  path: '/dashboard/accounts',
  queryKey: 'account',
}
