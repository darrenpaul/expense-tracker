<template>
  <section>
    <h1>{{ ACCOUNT_COPY.logIntoAccount }}</h1>
    <form>
      <!-- EMAIL -->
      <div class="input-group">
        <label for="displayName">{{ ACCOUNT_COPY.email }}</label>
        <input
          v-model="email"
          :placeholder="ACCOUNT_COPY.emailPlaceholder"
          name="email"
          type="email"
        />
      </div>

      <!-- PASSWORD -->
      <div class="input-group">
        <label for="displayName">{{ ACCOUNT_COPY.password }}</label>
        <input
          v-model="password"
          :placeholder="ACCOUNT_COPY.passwordPlaceHolder"
          name="password"
          type="password"
        />
      </div>
      <button @click="onLogin">{{ ACCOUNT_COPY.login }}</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import isEmail from 'validator/es/lib/isEmail'
import { ACCOUNT_COPY } from '~~/constants/copy'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { useAccount } from '~~/stores/account'
import { useCategories } from '~~/stores/categories'
import { useNotification } from '~~/stores/notification'
import { useUserSettings } from '~~/stores/userSettings'

const router = useRouter()
const account = useAccount()
const categories = useCategories()
const userSettings = useUserSettings()
const notification = useNotification()

const email = ref('')
const password = ref('')

onMounted(() => {
  if (account.authenticated === true) {
    router.replace(DASHBOARD_ROUTE.path)
  }
})

const onLogin = async (event: Event) => {
  event.preventDefault()

  if (email.value === '' || !isEmail(email.value)) {
    notification.addNotification({
      title: 'Notification Title',
      message: ACCOUNT_COPY.emailRequired,
      type: 'error',
    })
    return
  }

  if (password.value === '') {
    notification.addNotification({
      title: 'Notification Title',
      message: ACCOUNT_COPY.passwordRequired,
      type: 'error',
    })
    return
  }

  try {
    await account.login(email.value, password.value)
    if (account.authenticated) {
      categories.fetchCategories()
      userSettings.fetchUserSettings()
      router.replace(DASHBOARD_ROUTE.path)
    }
  } catch (error) {
    notification.addNotification({
      title: 'Notification Title',
      message: error.message,
      type: 'error',
    })
  }
}
</script>
