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
      <div class="input-group">
        <label for="displayName">{{ TRANSACTION_COPY.transactionType }}</label>
        <ul id="transactionTypeRadio" class="radio-buttons-container-column">
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

      <!-- ACCOUNT -->
      <div class="input-group">
        <label for="account">{{ TRANSACTION_COPY.account }}</label>
        <select id="account" v-model="account">
          <option disabled value="">{{ COMMON_COPY.selectOne }}</option>
          <option
            v-for="{ id, name: accountName } in accountStore.accounts"
            :key="id"
            :value="id"
            :selected="accountName === category"
          >
            {{ accountName }}
          </option>
        </select>
      </div>

      <div class="row">
        <!-- NAME -->
        <div class="input-group">
          <label for="name">{{ TRANSACTION_COPY.name }}</label>
          <input
            v-model="name"
            :placeholder="TRANSACTION_COPY.namePlaceholder"
            name="name"
            type="text"
          />
        </div>

        <!-- CATEGORY -->
        <div class="input-group">
          <label for="category">{{ TRANSACTION_COPY.category }}</label>
          <select v-model="category">
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

      <!-- NOTE -->
      <div class="input-group">
        <label for="displayName">{{ TRANSACTION_COPY.note }}</label>
        <input
          v-model="note"
          :placeholder="TRANSACTION_COPY.notePlaceholder"
          name="note"
          type="text"
        />
      </div>

      <!-- AMOUNT -->
      <div class="input-group">
        <label for="amount">{{ TRANSACTION_COPY.amount }}</label>
        <input
          v-model="amount"
          :placeholder="TRANSACTION_COPY.amountPlaceholder"
          name="amount"
          type="number"
        />
      </div>

      <!-- DATE PICKER -->
      <div class="input-group">
        <label for="datePicker">{{ TRANSACTION_COPY.date }}</label>
        <DatePicker id="datePicker" :date="date" @on-change="onDateSelect" />
      </div>

      <div class="row">
        <button class="button-secondary" @click="onCancel">
          {{ COMMON_COPY.cancel }}
        </button>
        <button @click="onSave">{{ COMMON_COPY.save }}</button>
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
import { TRANSACTION_TYPES } from '~~/constants/transactions'
import { useCategories } from '~~/stores/categories'
import { useNotification } from '~~/stores/notification'
import TrashIcon from '~~/components/icons/TrashIcon.vue'
import { useAccounts } from '~~/stores/accounts'
import { validateAmount, validateName } from '~~/helpers/validators'

const emit = defineEmits(['refresh', 'closeModal'])

const props = defineProps({
  transaction: { type: Object, default: () => {} },
})

const profile = useProfile()
const accountStore = useAccounts()
const categoryStore = useCategories()
const notification = useNotification()

const transactionType = ref(
  props.transaction?.type || TRANSACTION_TYPES[0].displayName
)
const name = ref(props.transaction?.name || '')
const account = ref((props.transaction?.account?.id as string) || '')
const category = ref((props.transaction?.category?.id as string) || '')
const note = ref(props.transaction?.note || '')
const amount = ref(props.transaction?.amount || 0.0)
const date = ref(
  props.transaction?.date || format(new Date(), DATE_TIME_FORMAT)
)
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
  // TRANSACTION ACCOUNT
  if (validateName(account.value, COMMON_COPY.accountError) === false)
    return false
  // TRANSACTION NAME
  if (validateName(name.value) === false) return false
  // TRANSACTION CATEGORY
  if (validateName(category.value, COMMON_COPY.categoryError) === false)
    return false
  // TRANSACTION AMOUNT
  if (!validateAmount(amount.value)) return false

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

const onDateSelect = (newDate: string) => {
  date.value = newDate
}

const onCancel = (event: Event) => {
  event.preventDefault()
  emit('closeModal')
}

const onSave = async (event: Event) => {
  event.preventDefault()

  if (fieldsValid() === false) {
    return false
  }

  if (!profile.userId) return

  // CREATE

  if (!props?.transaction?.id) {
    await onCreateTransaction()
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

const onCreateTransaction = async () => {
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

  await createTransaction(data)

  notification.addNotification({
    message: TRANSACTION_COPY.transactionAdded,
    type: 'success',
  })
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
