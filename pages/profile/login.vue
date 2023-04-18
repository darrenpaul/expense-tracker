<template>
  <div class="login-page-container">
    <div class="login-page-image-container">
      <img
        class="login-page-image"
        src="https://res.cloudinary.com/darren-paul-photography/image/upload/v1681830181/expense-tracker/login-page_kzie8r.webp"
      />
    </div>

    <div class="login-page-content-container">
      <div class="login-page-form-container">
        <h2 class="mb-8">{{ COPY.accountLogin }}</h2>

        <form class="max-w-sm">
          <!-- EMAIL -->
          <input
            v-model="email"
            class="input mb-4"
            :placeholder="COPY.emailPlaceholder"
            name="email"
            type="email"
          />

          <!-- PASSWORD -->
          <input
            v-model="password"
            class="input mb-4"
            :placeholder="COPY.passwordPlaceHolder"
            name="password"
            type="password"
          />
          <button class="button" @click="onLogin">{{ COPY.login }}</button>

          <p>
            {{ COPY.noAccount }}

            <NuxtLink class="navigation-link" :to="PROFILE_REGISTER_ROUTE.path">
              {{ PROFILE_REGISTER_ROUTE.displayName }}
            </NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
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
import { useBudgets } from '~~/stores/budgets'
import { PROFILE_REGISTER_ROUTE } from '~~/constants/routes/profile'

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
      useProfile().fetchAllData()
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

<style lang="scss">
@import '~~/assets/css/pages/profile/login.scss';
</style>
