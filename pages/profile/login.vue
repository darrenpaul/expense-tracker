<template>
  <section>
    <div class="card">
      <h2 class="mb-4">{{ COPY.accountLogin }}</h2>

      <form>
        <!-- EMAIL -->
        <div class="input-group">
          <div class="input-label-container">
            <label for="displayName">{{ COPY.email }}</label>
          </div>
          <input
            v-model="email"
            :placeholder="COPY.emailPlaceholder"
            name="email"
            type="email"
          />
        </div>

        <!-- PASSWORD -->
        <div class="input-group">
          <div class="input-label-container">
            <label for="displayName">{{ COPY.password }}</label>
          </div>
          <input
            v-model="password"
            :placeholder="COPY.passwordPlaceHolder"
            name="password"
            type="password"
          />
        </div>
        <button class="button" @click="onLogin">{{ COPY.login }}</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import isEmail from 'validator/es/lib/isEmail'
import COPY from '~~/constants/copy/profile'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { useProfile } from '~~/stores/profile'
import { useCategories } from '~~/stores/categories'
import { useNotification } from '~~/stores/notification'
import { useUserSettings } from '~~/stores/userSettings'
import { useAccounts } from '~~/stores/accounts'
import { useTransactions } from '~~/stores/transactions'
import { useGoals } from '~~/stores/goals'

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
      message: COPY.emailRequired,
      type: 'error',
    })
    return false
  }

  if (password.value === '') {
    notification.addNotification({
      message: COPY.passwordRequired,
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
      categories.fetch()
      userSettings.fetch()
      accountStore.fetch()
      transactionsStore.fetch()
      useGoals().fetch()
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
