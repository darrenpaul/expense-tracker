<template>
  <div>
    <div class="row between mb-4">
      <h2>{{ headingCopy }}</h2>
      <button
        v-if="!isEmpty(props.transaction)"
        class="button-icon"
        @click="onShowConfirmDialog"
      >
        <TrashIcon :size="'20'" />
      </button>
    </div>

    <form>
      <!-- TRANSACTION TYPE -->
      <TransactionTypeSelect
        :selected="transactionType"
        @on-change="transactionType = $event"
      />

      <!-- ACCOUNT & NAME & CATEGORY -->
      <template
        v-if="transactionType !== TRANSACTION_TYPE_TRANSFER.displayName"
      >
        <!-- ACCOUNT -->
        <div class="input-group">
          <div class="input-label-container">
            <label for="account">{{ TRANSACTION_COPY.account }}</label>
          </div>
          <Dropdown
            v-model="account"
            :options="accountOptions"
            :selected="account"
            @selection-updated="account = $event"
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
      <!-- ACCOUNT TRANSFER -->
      <template
        v-if="transactionType === TRANSACTION_TYPE_TRANSFER.displayName"
      >
        <!-- FROM ACCOUNT -->
        <div class="input-group">
          <div class="input-label-container">
            <label for="account">{{ TRANSACTION_COPY.fromAccount }}</label>
          </div>

          <Dropdown
            v-model="account"
            :options="accountOptions"
            :selected="account"
            @selection-updated="account = $event"
          />
        </div>

        <!-- TO ACCOUNT -->
        <div class="input-group">
          <div class="input-label-container">
            <label for="accountTransfer">
              {{ TRANSACTION_COPY.toAccount }}
            </label>
          </div>

          <Dropdown
            v-model="accountTransfer"
            :options="accountOptions"
            :selected="accountTransfer"
            @selection-updated="accountTransfer = $event"
          />
        </div>
      </template>

      <!-- NAME -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="name">{{ TRANSACTION_COPY.name }}</label>
        </div>
        <input
          id="name"
          v-model="name"
          :placeholder="TRANSACTION_COPY.namePlaceholder"
          name="name"
          type="text"
        />
      </div>

      <!-- AMOUNT -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="amount">{{ TRANSACTION_COPY.amount }}</label>
        </div>
        <input
          id="amount"
          v-model="amount"
          :placeholder="TRANSACTION_COPY.amountPlaceholder"
          name="amount"
          type="number"
        />
      </div>

      <!-- DATE PICKER -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="datePicker">{{ TRANSACTION_COPY.date }}</label>
        </div>
        <DatePicker id="datePicker" :date="date" @on-change="date = $event" />
      </div>

      <!-- NOTE -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="note">{{ TRANSACTION_COPY.note }}</label>
        </div>
        <textarea
          id="note"
          v-model="note"
          :placeholder="TRANSACTION_COPY.notePlaceholder"
          name="note"
          type="text"
        />
      </div>

      <!-- BUTTONS -->
      <CancelSaveButtons
        @on-cancel="onCancel"
        @on-save="onCreateUpdateTransaction"
      />
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
import TRANSACTION_COPY from '~~/constants/copy/transactions'
import { DATE_FORMAT, DATE_TIME_FORMAT } from '~~/helpers/dateTimeHelper'
import { updateTransaction, deleteTransaction } from '~~/endpoints/transaction'
import { useProfile } from '~~/stores/profile'
import { INewTransaction, ITransaction } from '~~/types/transaction'
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER,
} from '~~/constants/transactions'
import { useCategories } from '~~/stores/categories'
import { useNotification } from '~~/stores/notification'
import TrashIcon from '~~/components/icons/TrashIcon.vue'
import { useAccounts } from '~~/stores/accounts'
import { useTransactions } from '~~/stores/transactions'
import {
  validateAmount,
  validateName,
  validateUnique,
} from '~~/helpers/validators'
import TransactionTypeSelect from '~~/components/TransactionTypeSelect.vue'

const emit = defineEmits(['refresh', 'closeModal'])

const props = defineProps({
  transaction: { type: Object, default: () => {} },
})

const profile = useProfile()
const accountStore = useAccounts()
const categoryStore = useCategories()
const notification = useNotification()
const transactionStore = useTransactions()

const transactionType = ref(
  props.transaction?.type || TRANSACTION_TYPES[0].displayName
)
const name = ref(props.transaction?.name || '')
const account = ref((props.transaction?.account?.id as string) || '')
const accountTransfer = ref((props.transaction?.account?.id as string) || '')
const category = ref((props.transaction?.category?.id as string) || '')
const amount = ref(props.transaction?.amount)
const date = ref(
  props.transaction?.date || format(new Date(), DATE_TIME_FORMAT)
)
const note = ref(props.transaction?.note || '')
const showConfirmDialog = ref(false)

const headingCopy = computed(() => {
  if (isEmpty(props.transaction)) {
    return TRANSACTION_COPY.addTransaction
  }
  return TRANSACTION_COPY.editTransaction
})

const categoryOptions = computed(() => {
  return categoryStore.categories
    .filter((item) => item.transactionType === transactionType.value)
    .map(({ id, name }) => ({
      value: id,
      label: name,
    }))
})

const accountOptions = computed(() => {
  return accountStore.accounts.map(({ id, name }) => ({
    value: id,
    label: name,
  }))
})

const fieldsValid = () => {
  if (!profile.userId) return false

  // TRANSACTION ACCOUNT
  if (
    validateName(account.value, TRANSACTION_COPY.accountNameError) === false
  ) {
    return false
  }

  if (transactionType.value === TRANSACTION_TYPE_TRANSFER.displayName) {
    // TRANSACTION TRANSFER ACCOUNT
    if (
      validateName(accountTransfer.value, TRANSACTION_COPY.accountError) ===
      false
    ) {
      return false
    }

    // TRANSACTION TRANSFER ACCOUNT
    if (
      validateUnique(
        account.value,
        accountTransfer.value,
        TRANSACTION_COPY.accountTransferMatchError
      ) === false
    ) {
      return false
    }
  }

  // TRANSACTION NAME
  if (validateName(name.value) === false) return false

  // TRANSACTION AMOUNT
  if (!validateAmount(amount.value)) {
    return false
  }

  return true
}

const clearFields = () => {
  name.value = ''
  category.value = ''
  note.value = ''
  amount.value = 0.0
  date.value = format(new Date(), DATE_FORMAT)
}

const onShowConfirmDialog = () => {
  showConfirmDialog.value = true
}

const onCloseConfirmDialog = () => {
  showConfirmDialog.value = false
}

const onConfirmConfirmDialog = () => {
  showConfirmDialog.value = false
  onDelete()
}

const onCancel = () => {
  emit('closeModal')
}

const onCreateUpdateTransaction = async () => {
  if (fieldsValid() === false) {
    return false
  }

  // CREATE
  if (!props?.transaction?.id) {
    if (transactionType.value === TRANSACTION_TYPE_TRANSFER.displayName) {
      await onCreateTransactionTransfer()
    } else {
      await onCreateTransaction()
    }
  }

  // UPDATE
  if (props?.transaction?.id) {
    await onUpdateTransaction()
  }

  clearFields()
  emit('refresh')
}

const onDelete = async () => {
  const transactionId = props.transaction.id
  await deleteTransaction(transactionId)

  notification.addNotification({
    message: TRANSACTION_COPY.deleted,
    type: 'warn',
  })
  clearFields()
  emit('refresh')
  emit('closeModal')
}

const onCreateTransaction = () => {
  const data: INewTransaction = {
    userId: profile.userId,
    type: transactionType.value,
    accountId: account.value,
    name: name.value,
    note: note.value,
    categoryId: category.value,
    amount: amount.value,
    date: date.value,
  }

  transactionStore.handleCreateTransaction(data)
}

const onCreateTransactionTransfer = async () => {
  const transactionName = `${TRANSACTION_COPY.transfer} ${name.value}`
  const fromData: INewTransaction = {
    userId: profile.userId,
    type: TRANSACTION_TYPE_EXPENSE.displayName,
    accountId: account.value,
    name: transactionName,
    note: note.value,
    amount: amount.value,
    date: date.value,
  }

  const toDate: INewTransaction = {
    userId: profile.userId,
    type: TRANSACTION_TYPE_INCOME.displayName,
    accountId: accountTransfer.value,
    name: transactionName,
    note: note.value,
    amount: amount.value,
    date: date.value,
  }

  transactionStore.handleCreateTransaction(fromData)
  transactionStore.handleCreateTransaction(toDate)
}

const onUpdateTransaction = async () => {
  const data: ITransaction = {
    id: props.transaction.id,
    type: transactionType.value,
    accountId: account.value,
    name: name.value,
    note: note.value,
    categoryId: category.value,
    amount: amount.value,
    date: date.value,
  }
  await updateTransaction(data)

  notification.addNotification({
    message: TRANSACTION_COPY.updated,
    type: 'success',
  })

  emit('closeModal', true)
}
</script>
