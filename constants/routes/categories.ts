import CategoryIcon from '~~/components/icons/dashboardNavigation/CategoryIcon.vue'

export const CATEGORIES_ROUTE = {
  name: 'categories',
  displayName: 'Categories',
  path: '/dashboard/categories',
  auth: true,
  icon: CategoryIcon,
}
