<template>
  <div class="form-container">
    <h2>{{ headingCopy }}</h2>

    <form class="form">
      <!-- TRANSACTION TYPE -->
      <TransactionTypeSelect
        :selected="transactionType"
        @on-change="transactionType = $event"
      />

      <!-- ACCOUNT & NAME & CATEGORY -->
      <template
        v-if="transactionType !== TRANSACTION_TYPE_TRANSFER.displayName"
      >
        <div class="input-groups">
          <!-- ACCOUNT -->
          <div class="input-group">
            <label class="label" for="account">{{ COPY.account }}</label>
            <Dropdown
              v-model="account"
              :options="accountOptions"
              :selected="account"
              @selection-updated="account = $event"
            />
          </div>

          <!-- CATEGORY -->
          <div class="input-group">
            <label class="label" for="category">{{ COPY.category }}</label>

            <Dropdown
              v-model="category"
              :options="categoryOptions"
              :selected="category"
              @selection-updated="category = $event"
            />
          </div>
        </div>
      </template>

      <!-- ACCOUNT TRANSFER -->
      <template
        v-if="transactionType === TRANSACTION_TYPE_TRANSFER.displayName"
      >
        <div class="input-groups">
          <!-- FROM ACCOUNT -->
          <div class="input-group">
            <label class="label" for="account">{{ COPY.fromAccount }}</label>

            <Dropdown
              v-model="account"
              :options="accountOptions"
              :selected="account"
              @selection-updated="account = $event"
            />
          </div>

          <!-- TO ACCOUNT -->
          <div class="input-group">
            <label class="label" for="accountTransfer">
              {{ COPY.toAccount }}
            </label>

            <Dropdown
              v-model="accountTransfer"
              :options="accountOptions"
              :selected="accountTransfer"
              @selection-updated="accountTransfer = $event"
            />
          </div>
        </div>
      </template>

      <div class="input-groups">
        <!-- NAME -->
        <div class="input-group">
          <label class="label" for="name">{{ COPY.name }}</label>
          <input
            id="name"
            v-model="name"
            class="input"
            :placeholder="COPY.namePlaceholder"
            name="name"
            type="text"
          />
        </div>

        <!-- AMOUNT -->
        <div class="input-group">
          <label class="label" for="amount">{{ COPY.amount }}</label>

          <input
            id="amount"
            v-model="amount"
            class="input"
            :placeholder="COPY.amountPlaceholder"
            name="amount"
            pattern="[0-9]*"
            type="text"
          />
        </div>
      </div>

      <!-- DATE PICKER -->
      <div class="input-group">
        <label class="label" for="datePicker">{{ COPY.date }}</label>
        <DatePicker id="datePicker" :date="date" @on-change="date = $event" />
      </div>

      <!-- NOTE -->
      <div class="input-group">
        <label class="label" for="note">{{ COPY.note }}</label>

        <textarea
          id="note"
          v-model="note"
          class="textarea"
          :placeholder="COPY.notePlaceholder"
          name="note"
          type="text"
        />
      </div>

      <div>
        <button
          v-if="!isEmpty(transaction)"
          class="button-warn"
          type="button"
          @click="onShowConfirmDialog"
        >
          {{ COPY.delete }}
        </button>

        <!-- BUTTONS -->
        <CancelSaveButtons
          @on-cancel="onCancel"
          @on-save="onCreateUpdateTransaction"
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
import { format, isDate } from 'date-fns'
import { isEmpty } from 'lodash-es'
import CancelSaveButtons from '~~/components/CancelSaveButtons.vue'
import ConfirmDialog from '~~/components/dialogs/ConfirmDialog.vue'
import COPY from '~~/constants/copy/transactions'
import { DATE_FORMAT, DATE_TIME_FORMAT } from '~~/helpers/dateTimeHelper'
import { useProfile } from '~~/stores/profile'
import { INewTransaction, ITransaction } from '~~/types/transaction'
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_EXPENSE,
  TRANSACTION_TYPE_INCOME,
  TRANSACTION_TYPE_TRANSFER,
} from '~~/constants/transactions'
import { useCategories } from '~~/stores/categories'
import { useAccounts } from '~~/stores/accounts'
import { useTransactions } from '~~/stores/transactions'
import { validateAmount, validateName } from '~~/helpers/validators'
import TransactionTypeSelect from '~~/components/TransactionTypeSelect/index.vue'
import { TRANSACTION_FORM_ROUTE } from '~~/constants/routes/transactions'
import { removeQuery, getQuery } from '~~/helpers/routerQuery'

const emit = defineEmits(['refresh'])

const props = defineProps({
  transaction: { type: Object, default: () => {} },
})

const profile = useProfile()
const accountStore = useAccounts()
const categoryStore = useCategories()
const transactionStore = useTransactions()

const transaction = ref()
const transactionType = ref(TRANSACTION_TYPES[0].displayName)
const name = ref()
const account = ref()
const accountTransfer = ref()
const category = ref()
const amount = ref()
const date = ref(format(new Date(), DATE_TIME_FORMAT))
const note = ref(props.transaction?.note || '')
const showConfirmDialog = ref(false)

onBeforeMount(() => {
  const transactionId = getQuery(TRANSACTION_FORM_ROUTE.queryKey)
  if (transactionId !== 'new') {
    transaction.value = transactionStore?.transactions.find(
      ({ id }) => id === transactionId
    )

    transactionType.value = transaction.value?.type
    name.value = transaction.value?.name
    account.value = transaction.value?.account?.id
    category.value = transaction.value?.category?.id
    amount.value = transaction.value?.amount
    date.value = transaction.value?.date
    note.value = transaction.value?.note
  }
})

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'auto' })
})

const headingCopy = computed(() => {
  if (isEmpty(props.transaction)) {
    return COPY.addTransaction
  }
  return COPY.editTransaction
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
  if (validateName(account.value, COPY.accountNameError) === false) {
    return false
  }

  // TRANSACTION NAME
  if (validateName(name.value) === false) return false

  // TRANSACTION AMOUNT
  if (!validateAmount(amount.value)) {
    return false
  }

  if (!isDate(new Date(date.value))) {
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
  removeQuery(TRANSACTION_FORM_ROUTE.queryKey)
}

const onCreateUpdateTransaction = async () => {
  if (fieldsValid() === false) return false
  // CREATE
  if (transaction.value === undefined) {
    if (transactionType.value === TRANSACTION_TYPE_TRANSFER.displayName) {
      await onCreateTransactionTransfer()
    } else {
      await onCreateTransaction()
    }
  }

  // UPDATE
  if (transaction.value.id !== undefined) {
    await onUpdateTransaction()
  }

  clearFields()
  emit('refresh')
}

const onDelete = () => {
  const transactionId = transaction.value.id
  transactionStore.handleDeleteTransaction(transactionId)

  clearFields()
  removeQuery(TRANSACTION_FORM_ROUTE.queryKey)
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
  removeQuery(TRANSACTION_FORM_ROUTE.queryKey)
}

const onCreateTransactionTransfer = async () => {
  const transactionName = `${COPY.transfer} ${name.value}`

  const fromAccount = accountStore.accounts.find(
    ({ id }) => id === account.value
  )
  const toAccount = accountStore.accounts.find(
    ({ id }) => id === accountTransfer.value
  )

  const dataNote = `Transfer from ${fromAccount?.name} to ${toAccount?.name}\n${note.value}`

  const fromData: INewTransaction = {
    userId: profile.userId,
    type: TRANSACTION_TYPE_EXPENSE.displayName,
    accountId: account.value,
    name: transactionName,
    note: dataNote,
    amount: amount.value,
    date: date.value,
  }

  const toDate: INewTransaction = {
    userId: profile.userId,
    type: TRANSACTION_TYPE_INCOME.displayName,
    accountId: accountTransfer.value,
    name: transactionName,
    note: dataNote,
    amount: amount.value,
    date: date.value,
  }

  transactionStore.handleCreateTransaction(fromData)
  transactionStore.handleCreateTransaction(toDate)
  removeQuery(TRANSACTION_FORM_ROUTE.queryKey)
}

const onUpdateTransaction = () => {
  const data: ITransaction = {
    id: transaction.value.id,
    type: transactionType.value,
    accountId: account.value,
    name: name.value,
    note: note.value,
    categoryId: category.value,
    amount: amount.value,
    date: date.value,
  }
  transactionStore.handleUpdateTransaction(data)

  removeQuery(TRANSACTION_FORM_ROUTE.queryKey)
}
</script>
