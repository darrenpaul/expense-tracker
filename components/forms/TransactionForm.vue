<template>
  <div>
    <div class="flex between mb-2">
      <h3>{{ headingCopy }}</h3>
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
          v-if="!isEmpty(props.transaction)"
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
import { format } from 'date-fns'
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
import {
  validateAmount,
  validateName,
  validateUnique,
} from '~~/helpers/validators'
import TransactionTypeSelect from '~~/components/TransactionTypeSelect/index.vue'

const emit = defineEmits(['refresh', 'closeModal'])

const props = defineProps({
  transaction: { type: Object, default: () => {} },
})

const profile = useProfile()
const accountStore = useAccounts()
const categoryStore = useCategories()
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
  if (fieldsValid() === false) return false

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

const onDelete = () => {
  const transactionId = props.transaction.id
  transactionStore.handleDeleteTransaction(transactionId)

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
  emit('closeModal', true)
}

const onCreateTransactionTransfer = async () => {
  const transactionName = `${COPY.transfer} ${name.value}`
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
  emit('closeModal', true)
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

  transactionStore.handleUpdateTransaction(data)

  emit('closeModal', true)
}
</script>
