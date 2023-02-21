<template>
  <section>
    <h1>{{ ACCOUNT_COPY.registerAccount }}</h1>

    <form>
      <!-- USERNAME -->
      <div class="input-group">
        <label for="displayName">{{ ACCOUNT_COPY.username }}</label>
        <input
          v-model="username"
          :placeholder="ACCOUNT_COPY.usernamePlaceholder"
          name="username"
          type="text"
        />
      </div>

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

      <!-- PASSWORD & PASSWORD CONFIRM -->
      <div class="column">
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
        <div class="input-group">
          <label for="displayName">{{ ACCOUNT_COPY.passwordRepeat }}</label>
          <input
            v-model="passwordConfirm"
            :placeholder="ACCOUNT_COPY.passwordPlaceHolder"
            name="passwordConfirm"
            type="password"
          />
        </div>
      </div>

      <button @click="onRegisterUser">{{ ACCOUNT_COPY.register }}</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { createUserAccount } from '~~/endpoints/users'
import { ACCOUNT_COPY } from '~~/constants/copy'
// import { ACCOUNT_ROUTE } from '~~/constants/routes'
import { useAccount } from '~~/stores/account'

const router = useRouter()
const account = useAccount()

const username = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const registerHost = ref(false)

onMounted(() => {
  if (account.authenticated === true) {
    // router.replace(ACCOUNT_ROUTE.path)
  }
})

const onRegisterUser = async (event: Event) => {
  event.preventDefault()

  const userData = {
    username: username.value,
    name: username.value,
    email: email.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value,
  }

  await createUserAccount(userData)
  alert('user created')
}
</script>
