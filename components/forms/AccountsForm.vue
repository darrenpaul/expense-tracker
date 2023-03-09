<template>
  <div>
    <div class="row between">
      <h2>{{ headingCopy }}</h2>
      <button
        v-if="!isEmpty(props.account)"
        class="button-icon"
        @click="onShowConfirmDialog"
      >
        <TrashIcon :size="'20'" />
      </button>
    </div>

    <form>
      <!-- NAME -->
      <div class="input-group">
        <label for="name">{{ COMMON_COPY.accountName }}</label>
        <input
          v-model="name"
          :placeholder="COMMON_COPY.accountNamePlaceholder"
          name="name"
          type="text"
        />
      </div>

      <!-- ADD INITIAL AMOUNT -->
      <div class="input-group">
        <label for="addInitialAmount">{{ COMMON_COPY.addInitialAmount }}</label>
        <input
          id="addInitialAmount"
          v-model="addInitialAmount"
          class="checkbox"
          type="checkbox"
        />
      </div>

      <!-- AMOUNT AND CATEGORY -->
      <div v-if="addInitialAmount" class="row">
        <!-- AMOUNT -->
        <div class="input-group">
          <label for="amount">{{ COMMON_COPY.initialAmount }}</label>
          <input v-model="amount" name="amount" type="number" />
        </div>

        <!-- CATEGORY -->
        <div class="input-group">
          <label for="category">{{ TRANSACTION_COPY.category }}</label>
          <select v-model="category">
            <option disabled value="">{{ COMMON_COPY.selectOne }}</option>
            <option
              v-for="{
                id,
                name: categoryName,
              } in categoryStore.incomeCategories"
              :key="id"
              :value="id"
              :selected="categoryName === category"
            >
              {{ categoryName }}
            </option>
          </select>
        </div>
      </div>

      <!-- INCLUDE IN BALANCE -->
      <div class="input-group">
        <label for="includeInBalance">{{ COMMON_COPY.includeInBalance }}</label>
        <input
          id="includeInBalance"
          v-model="includeInBalance"
          class="checkbox"
          type="checkbox"
        />
      </div>

      <!-- BUTTONS -->
      <div class="row">
        <button class="button-secondary" @click="onCancel">
          {{ COMMON_COPY.cancel }}
        </button>
        <button @click="onAddUpdateAccount">{{ COMMON_COPY.save }}</button>
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
// COMPONENTS
import ConfirmDialog from '~~/components/dialogs/ConfirmDialog.vue'
import TrashIcon from '~~/components/icons/TrashIcon.vue'
// CONSTANTS
import { TRANSACTION_TYPE_INCOME } from '~~/constants/transactions'
import { COMMON_COPY, TRANSACTION_COPY } from '~~/constants/copy'
// HELPERS
import { validateName, validateAmount } from '~~/helpers/validators'
import { DATE_TIME_FORMAT } from '~~/helpers/dateTimeHelper'
// TYPES
import { IAccount, INewAccount } from '~~/types/account'
import { INewTransaction } from '~~/types/transaction'
// ENDPOINTS
import {
  createAccount,
  deleteAccount,
  updateAccount,
} from '~~/endpoints/accounts'
import { createTransaction } from '~~/endpoints/transaction'
// STORES
import { useProfile } from '~~/stores/profile'
import { useNotification } from '~~/stores/notification'
import { useAccounts } from '~~/stores/accounts'
import { useCategories } from '~~/stores/categories'
import { useTransactions } from '~~/stores/transactions'

const emit = defineEmits(['closeModal'])

const props = defineProps({
  account: { type: Object, default: () => {} },
})

const notification = useNotification()
const profile = useProfile()
const accountStore = useAccounts()
const categoryStore = useCategories()
const transactionStore = useTransactions()

const name = ref(props.account?.name || '')
const amount = ref(props.account?.amount || 0.0)
const category = ref((props.account?.category?.id as string) || '')
const includeInBalance = ref(props.account?.includeInBalance)
const showConfirmDialog = ref(false)
const addInitialAmount = ref(false)

const headingCopy = computed(() => {
  if (isEmpty(props.account)) {
    return COMMON_COPY.addAccount
  }
  return COMMON_COPY.editAccount
})

const fieldsValid = () => {
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
  event.preventDefault()
  emit('closeModal')
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
    id: props.account.id,
    userId: profile.userId,
    name: name.value,
    includeInBalance: includeInBalance.value,
  }

  await updateAccount(data)

  notification.addNotification({
    message: COMMON_COPY.updated,
    type: 'success',
  })
}

const onAddUpdateAccount = async (event: Event) => {
  event.preventDefault()

  if (fieldsValid() === false) {
    return false
  }

  if (!profile.authenticated) return

  // UPDATE ACCOUNT
  if (props.account?.name) {
    await onUpdateAccount()
  }

  // ADD ACCOUNT
  if (!props.account?.name) {
    await onAddAccount()
  }

  transactionStore.fetch()
  accountStore.fetchAccounts()

  emit('closeModal')
}

const onDeleteAccount = async () => {
  const accountId = props.account.id
  await deleteAccount(accountId)
  accountStore.fetchAccounts()

  notification.addNotification({
    message: COMMON_COPY.delete,
    type: 'warn',
  })

  emit('closeModal')
}
</script>
