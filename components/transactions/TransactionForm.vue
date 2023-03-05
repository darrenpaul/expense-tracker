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
        <label for="displayName">{{ TRANSACTION_COPY.amount }}</label>
        <input
          v-model="amount"
          :placeholder="TRANSACTION_COPY.amountPlaceholder"
          name="amount"
          type="number"
        />
      </div>

      <!-- DATE PICKER -->
      <div class="input-group">
        <label for="displayName">{{ TRANSACTION_COPY.date }}</label>
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
import { useAccount } from '~~/stores/account'
import { INewTransaction, ITransaction } from '~~/types/transaction'
import { TRANSACTION_TYPES } from '~~/constants/transactions'
import { useCategories } from '~~/stores/categories'
import { useUserSettings } from '~~/stores/userSettings'
import { useNotification } from '~~/stores/notification'
import TrashIcon from '~~/components/icons/TrashIcon.vue'

const emit = defineEmits(['refresh', 'closeModal'])

const props = defineProps({
  transaction: { type: Object, default: () => {} },
})

const account = useAccount()
const userSettings = useUserSettings()
const categoryStore = useCategories()
const notification = useNotification()

const transactionType = ref(
  props.transaction?.type || TRANSACTION_TYPES[0].displayName
)
const name = ref(props.transaction?.name || '')
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
  if (name.value === '' || name.value === null || name.value === undefined) {
    notification.addNotification({
      message: TRANSACTION_COPY.nameRequired,
      type: 'error',
    })
    return false
  }

  if (
    category.value === '' ||
    category.value === null ||
    category.value === undefined
  ) {
    notification.addNotification({
      message: TRANSACTION_COPY.categoryRequired,
      type: 'error',
    })
    return false
  }

  if (
    amount.value <= 0.0 ||
    amount.value === null ||
    amount.value === undefined
  ) {
    notification.addNotification({
      message: TRANSACTION_COPY.amountRequired,
      type: 'error',
    })
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

  if (!account.userId) return

  if (props?.transaction?.id) {
    const data: ITransaction = {
      id: props.transaction.id,
      type: transactionType.value,
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
  } else {
    const data: INewTransaction = {
      userId: account.userId,
      type: transactionType.value,
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
</script>
