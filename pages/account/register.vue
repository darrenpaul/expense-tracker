<template>
  <section>
    <h1>{{ ACCOUNT_COPY.registerAccount }}</h1>

    <form>
      <!-- FIRST NAME & LAST NAME -->
      <div class="column">
        <!-- FIRST NAME -->
        <div class="input-group">
          <label for="displayName">{{ ACCOUNT_COPY.firstName }}</label>
          <input
            v-model="firstName"
            :placeholder="ACCOUNT_COPY.firstName"
            name="fname"
            type="text"
          />
        </div>

        <!-- LAST NAME -->
        <div class="input-group">
          <label for="displayName">{{ ACCOUNT_COPY.lastName }}</label>
          <input
            v-model="lastName"
            :placeholder="ACCOUNT_COPY.lastNamePlaceholder"
            name="lname"
            type="text"
          />
        </div>
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
import isEmail from 'validator/lib/isEmail'
import { createUserAccount } from '~~/endpoints/users'
import { ACCOUNT_COPY } from '~~/constants/copy'
// import { ACCOUNT_ROUTE } from '~~/constants/routes'
import { useAccount } from '~~/stores/account'
import { DASHBOARD_ROUTE } from '~~/constants/routes/dashboard'
import { createUserSettings } from '~~/endpoints/userSettings'
import { INewUserSettings } from '~~/types/userSettings'
import { createCategory } from '~~/endpoints/category'
import { INewCategory } from '~~/types/category'
import {
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
} from '~~/constants/transactions'
import { useNotification } from '~~/stores/notification'

const router = useRouter()
const account = useAccount()
const notification = useNotification()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')

onMounted(() => {
  if (account.authenticated === true) {
    router.replace(DASHBOARD_ROUTE.path)
  }
})

const onRegisterUser = async (event: Event) => {
  event.preventDefault()

  if (firstName.value === '') {
    notification.addNotification({
      title: 'Notification Title',
      message: ACCOUNT_COPY.firstNameRequired,
      type: 'error',
    })
    return
  }
  if (lastName.value === '') {
    notification.addNotification({
      title: 'Notification Title',
      message: ACCOUNT_COPY.lastNameRequired,
      type: 'error',
    })
    return
  }
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
  if (passwordConfirm.value === '') {
    notification.addNotification({
      title: 'Notification Title',
      message: ACCOUNT_COPY.passwordRequired,
      type: 'error',
    })
    return
  }

  if (password.value !== passwordConfirm.value) {
    notification.addNotification({
      title: 'Notification Title',
      message: ACCOUNT_COPY.passwordMustMatch,
      type: 'error',
    })
    return
  }

  const userData = {
    username: firstName.value.toLowerCase() + lastName.value.toLowerCase(),
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value,
  }

  try {
    const { id } = await createUserAccount(userData)

    await account.login(email.value, password.value)

    const userSettingsData: INewUserSettings = {
      userId: id,
      currency: 'ZAR',
    }

    await createUserSettings(userSettingsData)

    const userCategories: Array<INewCategory> = [
      {
        userId: id,
        transactionType: TRANSACTION_TYPE_EXPENSE.displayName,
        name: 'Groceries',
        icon: '',
      },
      {
        userId: id,
        transactionType: TRANSACTION_TYPE_EXPENSE.displayName,
        name: 'Petrol',
        icon: '',
      },
      {
        userId: id,
        transactionType: TRANSACTION_TYPE_INCOME.displayName,
        name: 'Salary',
        icon: '',
      },
    ]

    for (const category of userCategories) {
      await createCategory(category)
    }

    if (account.authenticated) {
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
