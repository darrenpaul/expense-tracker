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
import { ACCOUNT_COPY } from '~~/constants/copy'
import { HOME_ROUTE } from '~~/constants/routes/home'

import { useAccount } from '~~/stores/account'

const router = useRouter()
const account = useAccount()
const email = ref('')
const password = ref('')

onMounted(() => {
  if (account.authenticated === true) {
    router.replace(HOME_ROUTE.path)
  }
})

const onLogin = async (event: Event) => {
  event.preventDefault()

  await account.login(email.value, password.value)
  if (account.authenticated) {
    router.replace(HOME_ROUTE.path)
  }
}
</script>
