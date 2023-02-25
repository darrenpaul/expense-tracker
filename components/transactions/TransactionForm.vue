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
          <label for="displayName">{{ TRANSACTION_COPY.name }}</label>
          <input
            v-model="name"
            :placeholder="TRANSACTION_COPY.namePlaceholder"
            name="name"
            type="text"
          />
        </div>

        <!-- CATEGORY -->
        <div class="input-group">
          <label for="displayName">{{ TRANSACTION_COPY.category }}</label>
          <select v-model="category">
            <option disabled value="">{{ COMMON_COPY.selectOne }}</option>
            <option
              v-for="{ id, displayName } in transactionCategories"
              :key="id"
              :value="id"
            >
              {{ displayName }}
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
        <DatePicker id="datePicker" @on-change="onDateSelect" />
      </div>

      <button @click="onAdd">{{ COMMON_COPY.add }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import BasicRadio from '../radios/BasicRadio.vue'
import { COMMON_COPY, TRANSACTION_COPY } from '~~/constants/copy'
import { HOME_ROUTE } from '~~/constants/routes/home'
import { DATE_FORMAT } from '~~/helpers/dateTimeHelper'
import { createTransaction } from '~~/endpoints/transaction'
import { useAccount } from '~~/stores/account'
import { INewTransaction } from '~~/types/transaction'
import { TRANSACTION_TYPES } from '~~/constants/transactions'
import { useCategories } from '~~/stores/categories'

const emit = defineEmits(['change'])

const router = useRouter()
const account = useAccount()
const categoryStore = useCategories()

const transactionType = ref(TRANSACTION_TYPES[0].displayName)
const name = ref('')
const note = ref('')
const category = ref('')
const amount = ref(0.0)
const currency = ref('')
const date = ref(format(new Date(), DATE_FORMAT))

const onDateSelect = (newDate: string) => {
  date.value = newDate
}

const transactionCategories = computed(() => {
  return categoryStore.categoryList.filter(
    (item) => item.transactionType === transactionType.value
  )
})

const onAdd = async (event: Event) => {
  event.preventDefault()

  if (!account.userId) return

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
  emit('change')
}
</script>
