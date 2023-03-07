<template>
  <div>
    <div class="row between">
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
      <div class="input-group">
        <label for="transactionTypeRadio">{{
          TRANSACTION_COPY.transactionType
        }}</label>
        <ul id="transactionTypeRadio" class="radio-buttons-container">
          <BasicRadio
            v-for="{ id, displayName } in TRANSACTION_TYPES"
            :key="id"
            :element-id="`transactionFormTransactionType-${id}`"
            :element-name="'transactionFormTransactionType'"
            :value="displayName"
            :selected="transactionType"
            :label-text="displayName"
            @change="(value:string) => transactionType = value"
          />
        </ul>
      </div>

      <!-- ACCOUNT & NAME & CATEGORY -->
      <template
        v-if="transactionType !== TRANSACTION_TYPE_TRANSFER.displayName"
      >
        <!-- ACCOUNT & CATEGORY -->
        <div class="row">
          <!-- ACCOUNT -->
          <div class="input-group">
            <label for="account">{{ TRANSACTION_COPY.account }}</label>
            <select id="account" v-model="account">
              <option disabled value="">{{ COMMON_COPY.selectOne }}</option>
              <option
                v-for="{ id, name: accountName } in accountStore.accounts"
                :key="id"
                :value="id"
                :selected="accountName === account"
              >
                {{ accountName }}
              </option>
            </select>
          </div>

          <!-- CATEGORY -->
          <div class="input-group">
            <label for="category">{{ TRANSACTION_COPY.category }}</label>
            <select id="category" v-model="category">
              <option disabled value="">{{ COMMON_COPY.selectOne }}</option>
              <option
                v-for="{ id, name: categoryName } in transactionCategories"
                :key="id"
                :value="id"
                :selected="categoryName === category"
              >
                {{ categoryName }}
              </option>
            </select>
          </div>
        </div>

        <!-- NAME & AMOUNT -->
        <div class="row">
          <!-- NAME -->
          <div class="input-group">
            <label for="name">{{ TRANSACTION_COPY.name }}</label>
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
            <label for="amount">{{ TRANSACTION_COPY.amount }}</label>
            <input
              id="amount"
              v-model="amount"
              :placeholder="TRANSACTION_COPY.amountPlaceholder"
              name="amount"
              type="number"
            />
          </div>
        </div>
      </template>

      <!-- ACCOUNT TRANSFER -->
      <template
        v-if="transactionType === TRANSACTION_TYPE_TRANSFER.displayName"
      >
        <!-- FROM ACCOUNT -->
        <div class="row">
          <div class="input-group">
            <label for="account">{{ TRANSACTION_COPY.fromAccount }}</label>
            <select id="account" v-model="account">
              <option disabled value="">{{ COMMON_COPY.selectOne }}</option>
              <option
                v-for="{ id, name: accountName } in accountStore.accounts"
                :key="id"
                :value="id"
                :selected="accountName === account"
              >
                {{ accountName }}
              </option>
            </select>
          </div>
          <!-- FROM ACCOUNT CATEGORY -->
          <div class="input-group">
            <label for="category">{{ TRANSACTION_COPY.category }}</label>
            <select id="category" v-model="category">
              <option disabled value="">{{ COMMON_COPY.selectOne }}</option>
              <option
                v-for="{
                  id,
                  name: categoryName,
                } in categoryStore.expenseCategories"
                :key="id"
                :value="id"
                :selected="categoryName === category"
              >
                {{ categoryName }}
              </option>
            </select>
          </div>
        </div>

        <!-- TO ACCOUNT -->
        <div class="row">
          <div class="input-group">
            <label for="accountTransfer">{{
              TRANSACTION_COPY.toAccount
            }}</label>
            <select id="accountTransfer" v-model="accountTransfer">
              <option disabled value="">{{ COMMON_COPY.selectOne }}</option>
              <option
                v-for="{ id, name: accountName } in accountStore.accounts"
                :key="id"
                :value="id"
                :selected="accountName === accountTransfer"
              >
                {{ accountName }}
              </option>
            </select>
          </div>

          <!-- TO ACCOUNT CATEGORY -->
          <div class="input-group">
            <label for="categoryTransfer">{{
              TRANSACTION_COPY.category
            }}</label>
            <select id="categoryTransfer" v-model="categoryTransfer">
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

        <!-- NAME & AMOUNT -->
        <div class="row">
          <!-- NAME -->
          <div class="input-group">
            <label for="name">{{ TRANSACTION_COPY.name }}</label>
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
            <label for="amount">{{ TRANSACTION_COPY.amount }}</label>
            <input
              id="amount"
              v-model="amount"
              :placeholder="TRANSACTION_COPY.amountPlaceholder"
              name="amount"
              type="number"
            />
          </div>
        </div>
      </template>

      <!-- DATE PICKER -->
      <div class="input-group">
        <label for="datePicker">{{ TRANSACTION_COPY.date }}</label>
        <DatePicker id="datePicker" :date="date" @on-change="date = $event" />
      </div>

      <!-- NOTE -->
      <div class="input-group">
        <label for="note">{{ TRANSACTION_COPY.note }}</label>
        <input
          id="note"
          v-model="note"
          :placeholder="TRANSACTION_COPY.notePlaceholder"
          name="note"
          type="text"
        />
      </div>

      <!-- LINK GOAL -->
      <div
        v-if="transactionType === TRANSACTION_TYPE_EXPENSE.displayName"
        class="input-group"
      >
        <label for="goal">{{ COMMON_COPY.goalPayment }}</label>
        <select id="goal" v-model="goal">
          <option disabled value="">{{ COMMON_COPY.selectOne }}</option>
          <option value="">{{ COMMON_COPY.notGoal }}</option>
          <option
            v-for="{ id, name: goalName } in goalStore.goals"
            :key="id"
            :value="id"
            :selected="goalName === category"
          >
            {{ goalName }}
          </option>
        </select>
      </div>

      <!-- BUTTONS -->
      <div class="row">
        <button class="button-secondary" @click="onCancel">
          {{ COMMON_COPY.cancel }}
        </button>
        <button @click="onCreateUpdateTransaction">
          {{ COMMON_COPY.save }}
        </button>
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
import BasicRadio from '../radios/BasicRadio.vue'
import ConfirmDialog from '~~/components/dialogs/ConfirmDialog.vue'
import { COMMON_COPY, TRANSACTION_COPY } from '~~/constants/copy'
import { DATE_FORMAT, DATE_TIME_FORMAT } from '~~/helpers/dateTimeHelper'
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '~~/endpoints/transaction'
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
import { useGoals } from '~~/stores/goals'

const emit = defineEmits(['refresh', 'closeModal'])

const props = defineProps({
  transaction: { type: Object, default: () => {} },
})

const profile = useProfile()
const accountStore = useAccounts()
const categoryStore = useCategories()
const notification = useNotification()
const goalStore = useGoals()
const transactionStore = useTransactions()

const transactionType = ref(
  props.transaction?.type || TRANSACTION_TYPES[0].displayName
)
const name = ref(props.transaction?.name || '')
const account = ref((props.transaction?.account?.id as string) || '')
const accountTransfer = ref((props.transaction?.account?.id as string) || '')
const categoryTransfer = ref((props.transaction?.category?.id as string) || '')
const category = ref((props.transaction?.category?.id as string) || '')
const amount = ref(props.transaction?.amount || 0.0)
const date = ref(
  props.transaction?.date || format(new Date(), DATE_TIME_FORMAT)
)
const note = ref(props.transaction?.note || '')
const goal = ref(props.transaction?.goal?.id || '')
const showConfirmDialog = ref(false)

const headingCopy = computed(() => {
  if (isEmpty(props.transaction)) {
    return TRANSACTION_COPY.addTransaction
  }
  return TRANSACTION_COPY.editTransaction
})

const transactionCategories = computed(() => {
  return categoryStore.categoryList.filter(
    (item) => item.transactionType === transactionType.value
  )
})

const fieldsValid = () => {
  if (!profile.userId) return false

  // TRANSACTION ACCOUNT
  if (validateName(account.value, COMMON_COPY.accountError) === false) {
    return false
  }

  if (transactionType.value === TRANSACTION_TYPE_TRANSFER.displayName) {
    // TRANSACTION TRANSFER ACCOUNT
    if (
      validateName(accountTransfer.value, COMMON_COPY.accountError) === false
    ) {
      return false
    }

    // TRANSACTION TRANSFER ACCOUNT
    if (
      validateUnique(
        account.value,
        accountTransfer.value,
        COMMON_COPY.accountTransferMatchError
      ) === false
    ) {
      return false
    }

    // TRANSACTION CATEGORY
    if (validateName(category.value, COMMON_COPY.categoryError) === false) {
      return false
    }

    // TRANSACTION TRANSFER CATEGORY
    if (
      validateName(categoryTransfer.value, COMMON_COPY.categoryError) === false
    ) {
      return false
    }
  }

  // TRANSACTION NAME
  if (validateName(name.value) === false) return false

  // TRANSACTION CATEGORY
  if (validateName(category.value, COMMON_COPY.categoryError) === false) {
    return false
  }
  if (transactionType.value === TRANSACTION_TYPE_TRANSFER.displayName) {
    // TRANSACTION TRANSFER CATEGORY
    if (
      validateName(categoryTransfer.value, COMMON_COPY.categoryError) === false
    ) {
      return false
    }
  }

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

const onCancel = (event: Event) => {
  event.preventDefault()
  emit('closeModal')
}

const onCreateUpdateTransaction = async (event: Event) => {
  event.preventDefault()

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
    message: TRANSACTION_COPY.transactionDeleted,
    type: 'warn',
  })
  clearFields()
  emit('refresh')
  emit('closeModal')
}

const onCreateTransaction = () => {
  // Goal payments can only get expenses so this ensures that
  const goalId =
    transactionType.value === TRANSACTION_TYPE_EXPENSE.displayName
      ? goal.value
      : ''

  const data: INewTransaction = {
    userId: profile.userId,
    goalId,
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
    categoryId: category.value,
    amount: amount.value,
    date: date.value,
  }

  const toDate: INewTransaction = {
    userId: profile.userId,
    type: TRANSACTION_TYPE_INCOME.displayName,
    accountId: accountTransfer.value,
    name: transactionName,
    note: note.value,
    categoryId: categoryTransfer.value,
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
    message: TRANSACTION_COPY.transactionUpdated,
    type: 'success',
  })

  emit('closeModal', true)
}
</script>
