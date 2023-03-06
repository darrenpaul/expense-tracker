<template>
  <section>
    <h1>{{ COMMON_COPY.logIntoAccount }}</h1>
    <form>
      <!-- EMAIL -->
      <div class="input-group">
        <label for="displayName">{{ COMMON_COPY.email }}</label>
        <input
          v-model="email"
          :placeholder="COMMON_COPY.emailPlaceholder"
          name="email"
          type="email"
        />
      </div>

      <!-- PASSWORD -->
      <div class="input-group">
        <label for="displayName">{{ COMMON_COPY.password }}</label>
        <input
          v-model="password"
          :placeholder="COMMON_COPY.passwordPlaceHolder"
          name="password"
          type="password"
        />
      </div>
      <button @click="onLogin">{{ COMMON_COPY.login }}</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import isEmail from 'validator/es/lib/isEmail'
import { COMMON_COPY } from '~~/constants/copy'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { useProfile } from '~~/stores/profile'
import { useCategories } from '~~/stores/categories'
import { useNotification } from '~~/stores/notification'
import { useUserSettings } from '~~/stores/userSettings'
import { useAccounts } from '~~/stores/accounts'
import { useTransactions } from '~~/stores/transactions'

const router = useRouter()
const profile = useProfile()
const categories = useCategories()
const userSettings = useUserSettings()
const notification = useNotification()
const accountStore = useAccounts()
const transactionsStore = useTransactions()

const email = ref('')
const password = ref('')

onMounted(() => {
  if (profile.authenticated === true) {
    router.replace(DASHBOARD_ROUTE.path)
  }
})

const fieldsValid = () => {
  if (email.value === '' || !isEmail(email.value)) {
    notification.addNotification({
      message: COMMON_COPY.emailRequired,
      type: 'error',
    })
    return false
  }

  if (password.value === '') {
    notification.addNotification({
      message: COMMON_COPY.passwordRequired,
      type: 'error',
    })
    return false
  }

  return true
}

const onLogin = async (event: Event) => {
  event.preventDefault()

  if (fieldsValid() === false) {
    return false
  }

  try {
    await profile.login(email.value, password.value)
    if (profile.authenticated) {
      categories.fetchCategories()
      userSettings.fetchUserSettings()
      accountStore.fetchAccounts()
      transactionsStore.fetchTransactions()
      router.replace(DASHBOARD_ROUTE.path)
    }
  } catch (error) {
    notification.addNotification({
      message: error?.message,
      type: 'error',
    })
  }
}
</script>
