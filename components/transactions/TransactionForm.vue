<template>
  <div>
    <h1>{{ TRANSACTION_COPY.addTransaction }}</h1>
    <form>
      <ul id="transactionTypeRadio" class="radio-buttons-container-column">
        <BasicRadio
          v-for="{ id, displayName } in TRANSACTION_TYPES"
          :key="id"
          :element-id="`transactionType-${id}`"
          :element-name="'transactionType'"
          :value="displayName"
          :selected="transactionType"
          :label-text="displayName"
          @change="(value:string) => transactionType = value"
        />
      </ul>

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

const emit = defineEmits(['change'])

const router = useRouter()
const account = useAccount()

const transactionType = ref(TRANSACTION_TYPES[0].displayName)
const note = ref('')
const amount = ref('')
const date = ref(format(new Date(), DATE_FORMAT))

onMounted(() => {
  if (account.authenticated === true) {
    router.replace(HOME_ROUTE.path)
  }
})

const onDateSelect = (newDate: string) => {
  date.value = newDate
}

const onAdd = async (event: Event) => {
  event.preventDefault()

  if (!account.userId) return

  const data: INewTransaction = {
    userId: account.userId,
    type: 'Expense',
    note: note.value,
    amount: amount.value,
    date: date.value,
  }

  await createTransaction(data)
  alert('Added transaction')
  emit('change')
}
</script>
