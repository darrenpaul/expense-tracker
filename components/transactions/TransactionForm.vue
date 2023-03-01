<template>
  <div>
    <h2>{{ TRANSACTION_COPY.addTransaction }}</h2>
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

      <div class="column">
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

      <!-- AMOUNT & CURRENCY -->
      <div class="column">
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

        <!-- CURRENCY -->
        <div class="input-group">
          <label for="displayName">{{ TRANSACTION_COPY.currency }}</label>
          <input
            v-model="currency"
            :placeholder="TRANSACTION_COPY.currencyPlaceholder"
            name="currency"
            type="text"
          />
        </div>
      </div>

      <!-- DATE PICKER -->
      <div class="input-group">
        <label for="displayName">{{ TRANSACTION_COPY.date }}</label>
        <DatePicker id="datePicker" :date="date" @on-change="onDateSelect" />
      </div>

      <div class="column">
        <button class="button-secondary" @click="onCancel">
          {{ COMMON_COPY.cancel }}
        </button>
        <button @click="onSave">{{ COMMON_COPY.save }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import BasicRadio from '../radios/BasicRadio.vue'
import { COMMON_COPY, TRANSACTION_COPY } from '~~/constants/copy'
import { DATE_FORMAT } from '~~/helpers/dateTimeHelper'
import { createTransaction, updateTransaction } from '~~/endpoints/transaction'
import { useAccount } from '~~/stores/account'
import { INewTransaction, ITransaction } from '~~/types/transaction'
import { TRANSACTION_TYPES } from '~~/constants/transactions'
import { useCategories } from '~~/stores/categories'
import { useUserSettings } from '~~/stores/userSettings'

const emit = defineEmits(['refresh', 'closeModal'])

const props = defineProps({
  transaction: { type: Object, default: () => {} },
})

const account = useAccount()
const userSettings = useUserSettings()
const categoryStore = useCategories()

const transactionType = ref(
  props.transaction?.type || TRANSACTION_TYPES[0].displayName
)
const name = ref(props.transaction?.name || '')
const note = ref(props.transaction?.note || '')
const category = ref((props.transaction?.category?.id as string) || '')
const amount = ref(props.transaction?.amount || 0.0)
const currency = ref(props.transaction?.currency || userSettings.currency)
const date = ref(props.transaction?.date || format(new Date(), DATE_FORMAT))

const onDateSelect = (newDate: string) => {
  date.value = newDate
}

const transactionCategories = computed(() => {
  return categoryStore.categoryList.filter(
    (item) => item.transactionType === transactionType.value
  )
})

const onCancel = (event: Event) => {
  event.preventDefault()
  emit('closeModal')
}

const onSave = async (event: Event) => {
  event.preventDefault()

  if (!account.userId) return

  if (props?.transaction?.id) {
    const data: ITransaction = {
      id: props.transaction.id,
      type: transactionType.value,
      name: name.value,
      note: note.value,
      categoryId: category.value,
      amount: amount.value,
      currency: currency.value,
      date: date.value,
    }
    await updateTransaction(data)
    alert('Updated transaction')
  } else {
    const data: INewTransaction = {
      userId: account.userId,
      type: transactionType.value,
      name: name.value,
      note: note.value,
      categoryId: category.value,
      amount: amount.value,
      currency: currency.value,
      date: date.value,
    }

    await createTransaction(data)
    alert('Added transaction')
  }

  emit('refresh')
}
</script>
