<template>
  <div class="form-container">
    <h2>{{ headingCopy }}</h2>

    <form class="form">
      <!-- NAME -->
      <div class="input-group">
        <label class="label" for="name">{{ COMMON_COPY.accountName }}</label>
        <input
          v-model="name"
          class="input"
          :placeholder="COMMON_COPY.accountNamePlaceholder"
          name="name"
          type="text"
        />
      </div>

      <!-- ADD INITIAL AMOUNT -->
      <template v-if="!account?.id">
        <div class="input-group-checkbox">
          <label class="label" for="addInitialAmount">{{
            COMMON_COPY.addInitialAmount
          }}</label>
          <input
            id="addInitialAmount"
            v-model="addInitialAmount"
            class="checkbox"
            type="checkbox"
          />
        </div>

        <!-- AMOUNT AND CATEGORY -->
        <template v-if="addInitialAmount">
          <!-- AMOUNT -->
          <div class="input-group">
            <label class="label" for="amount">{{
              COMMON_COPY.initialAmount
            }}</label>

            <input
              id="amount"
              v-model="amount"
              class="input"
              :placeholder="TRANSACTION_COPY.amountPlaceholder"
              name="amount"
              pattern="[0-9]*"
              type="text"
            />
          </div>

          <!-- CATEGORY -->
          <div class="input-group">
            <label class="label" for="category">{{
              TRANSACTION_COPY.category
            }}</label>
            <Dropdown
              v-model="category"
              :options="categoryOptions"
              :selected="category"
              @selection-updated="category = $event"
            />
          </div>
        </template>
      </template>

      <!-- INCLUDE IN BALANCE -->
      <div class="input-group-checkbox">
        <label class="label" for="includeInBalance">
          {{ COMMON_COPY.includeInBalance }}
        </label>
        <input
          id="includeInBalance"
          v-model="includeInBalance"
          class="checkbox"
          type="checkbox"
        />
      </div>

      <!-- BUTTONS -->
      <div>
        <button
          v-if="!isEmpty(account)"
          class="button-warn"
          type="button"
          @click="onShowConfirmDialog"
        >
          {{ COPY.delete }}
        </button>

        <CancelSaveButtons
          @on-cancel="onCancel"
          @on-save="onAddUpdateAccount"
        />
      </div>
    </form>

    <ConfirmDialog
      :show="showConfirmDialog"
      @close-modal="onCloseConfirmDialog"
      @confirm="onConfirmConfirmDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { isEmpty } from 'lodash-es'
import CancelSaveButtons from '~~/components/CancelSaveButtons.vue'
import ConfirmDialog from '~~/components/dialogs/ConfirmDialog.vue'
import { TRANSACTION_TYPE_INCOME } from '~~/constants/transactions'
import { COMMON_COPY, TRANSACTION_COPY } from '~~/constants/copy'
import COPY from '~~/constants/copy/account'
import { validateName, validateAmount } from '~~/helpers/validators'
import { DATE_TIME_FORMAT } from '~~/helpers/dateTimeHelper'
import { IAccount, INewAccount } from '~~/types/account'
import { INewTransaction } from '~~/types/transaction'
import { deleteAccount, updateAccount } from '~~/endpoints/accounts'
import { createTransaction } from '~~/endpoints/transaction'
import { useProfile } from '~~/stores/profile'
import { useNotification } from '~~/stores/notification'
import { useAccounts } from '~~/stores/accounts'
import { useCategories } from '~~/stores/categories'
import { useTransactions } from '~~/stores/transactions'
import { ACCOUNT_FORM_ROUTE } from '~~/constants/routes/accounts'
import { removeQuery, getQuery } from '~~/helpers/routerQuery'

const notification = useNotification()
const profile = useProfile()
const accountStore = useAccounts()
const categoryStore = useCategories()
const transactionStore = useTransactions()

const account = ref()
const name = ref()
const amount = ref()
const category = ref()
const includeInBalance = ref()
const showConfirmDialog = ref(false)
const addInitialAmount = ref(false)

onBeforeMount(() => {
  const accountId = getQuery(ACCOUNT_FORM_ROUTE.queryKey)
  if (accountId !== 'new') {
    account.value = accountStore.accounts.find(({ id }) => id === accountId)
    name.value = account.value.name
    amount.value = account.value.amount
    category.value = account.value.category?.id
    includeInBalance.value = account.value.includeInBalance
  }
})

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'auto' })
})

const headingCopy = computed(() => {
  if (isEmpty(account.value)) {
    return COMMON_COPY.addAccount
  }
  return COMMON_COPY.editAccount
})

const categoryOptions = computed(() => {
  return categoryStore.incomeCategories.map(({ id, name }) => ({
    value: id,
    label: name,
  }))
})

const fieldsValid = () => {
  if (!profile.authenticated) return false
  // ACCOUNT NAME
  if (validateName(name.value) === false) return false

  if (addInitialAmount.value === true) {
    // INITIAL AMOUNT
    if (!validateAmount(amount.value)) return false
    // INITIAL AMOUNT CATEGORY
    if (validateName(category.value, COMMON_COPY.categoryError) === false)
      return false
  }

  return true
}

const onShowConfirmDialog = () => {
  showConfirmDialog.value = true
}

const onCloseConfirmDialog = () => {
  showConfirmDialog.value = false
}

const onConfirmConfirmDialog = () => {
  showConfirmDialog.value = false
  onDeleteAccount()
}

const onCancel = () => {
  removeQuery(ACCOUNT_FORM_ROUTE.queryKey)
}

interface IAddInitialTransaction {
  accountId: string
  accountName: string
}
const onAddInitialTransaction = async ({
  accountId,
  accountName,
}: IAddInitialTransaction) => {
  const transactionName = `${accountName} initial transaction`
  const transactionNote = `Initial transaction for ${accountName}`
  const data: INewTransaction = {
    userId: profile.userId,
    accountId,
    type: TRANSACTION_TYPE_INCOME.displayName,
    name: transactionName,
    note: transactionNote,
    categoryId: category.value,
    amount: amount.value,
    date: format(new Date(), DATE_TIME_FORMAT),
  }
  await createTransaction(data)
}

const onAddAccount = async () => {
  const data: INewAccount = {
    userId: profile.userId,
    name: name.value,
    includeInBalance: includeInBalance.value,
  }

  const { id: accountId, name: accountName } =
    await accountStore.handleCreateAccount(data)

  if (addInitialAmount.value === true) {
    await onAddInitialTransaction({ accountId, accountName })
  }

  notification.addNotification({
    message: COMMON_COPY.added,
    type: 'success',
  })
}

const onUpdateAccount = async () => {
  const data: IAccount = {
    id: account.value.id,
    name: name.value,
    includeInBalance: includeInBalance.value,
  }

  await updateAccount(data)

  notification.addNotification({
    message: COMMON_COPY.updated,
    type: 'success',
  })
}

const onAddUpdateAccount = async () => {
  if (fieldsValid() === false) return false

  // UPDATE ACCOUNT
  if (account.value?.name) {
    await onUpdateAccount()
  }

  // ADD ACCOUNT
  if (!account.value?.name) {
    await onAddAccount()
  }

  transactionStore.fetch()
  accountStore.fetch()

  removeQuery(ACCOUNT_FORM_ROUTE.queryKey)
}

const onDeleteAccount = async () => {
  const accountId = account.value.id
  await deleteAccount(accountId)
  accountStore.fetch()

  notification.addNotification({
    message: COMMON_COPY.delete,
    type: 'warn',
  })

  removeQuery(ACCOUNT_FORM_ROUTE.queryKey)
}
</script>
