import ProfileIcon from '~~/components/icons/mainNavigation/ProfileIcon.vue'

export const PROFILE_LOGIN_ROUTE = {
  name: 'profileLogin',
  displayName: 'Login',
  path: '/profile/login',
  auth: false,
}

export const PROFILE_REGISTER_ROUTE = {
  name: 'profileRegister',
  displayName: 'Register',
  path: '/profile/register',
  auth: false,
}

export const PROFILE_SETTINGS_ROUTE = {
  name: 'profileSettings',
  displayName: 'Settings',
  path: '/profile/settings',
  auth: true,
  icon: ProfileIcon,
}
