<template>
  <div>
    <div class="row between mb-4">
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
        <div class="input-label-container">
          <label for="name">{{ COMMON_COPY.accountName }}</label>
        </div>
        <input
          v-model="name"
          :placeholder="COMMON_COPY.accountNamePlaceholder"
          name="name"
          type="text"
        />
      </div>

      <template v-if="!props.account.id">
        <!-- ADD INITIAL AMOUNT -->
        <div class="input-group">
          <div class="input-label-container">
            <label for="addInitialAmount">{{
              COMMON_COPY.addInitialAmount
            }}</label>
          </div>
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
            <div class="input-label-container">
              <label for="amount">{{ COMMON_COPY.initialAmount }}</label>
            </div>

            <input
              id="amount"
              v-model="amount"
              :placeholder="TRANSACTION_COPY.amountPlaceholder"
              name="amount"
              type="number"
            />
          </div>

          <!-- CATEGORY -->
          <div class="input-group">
            <div class="input-label-container">
              <label for="category">{{ TRANSACTION_COPY.category }}</label>
            </div>
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
      <div class="input-group">
        <div class="input-label-container">
          <label for="includeInBalance">{{
            COMMON_COPY.includeInBalance
          }}</label>
        </div>
        <input
          id="includeInBalance"
          v-model="includeInBalance"
          class="checkbox"
          type="checkbox"
        />
      </div>

      <!-- BUTTONS -->
      <CancelSaveButtons @on-cancel="onCancel" @on-save="onAddUpdateAccount" />
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
const amount = ref(props.account?.amount)
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

const categoryOptions = computed(() => {
  return categoryStore.incomeCategories.map(({ id, name }) => ({
    value: id,
    label: name,
  }))
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
  accountStore.fetch()

  emit('closeModal')
}

const onDeleteAccount = async () => {
  const accountId = props.account.id
  await deleteAccount(accountId)
  accountStore.fetch()

  notification.addNotification({
    message: COMMON_COPY.delete,
    type: 'warn',
  })

  emit('closeModal')
}
</script>
