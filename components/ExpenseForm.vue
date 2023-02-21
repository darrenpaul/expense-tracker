<template>
  <div>
    <h1>{{ EXPENSE_COPY.addExpense }}</h1>
    <form>
      <!-- NOTE -->
      <div class="input-group">
        <label for="displayName">{{ EXPENSE_COPY.note }}</label>
        <input
          v-model="note"
          :placeholder="EXPENSE_COPY.notePlaceholder"
          name="note"
          type="text"
        />
      </div>

      <!-- AMOUNT -->
      <div class="input-group">
        <label for="displayName">{{ EXPENSE_COPY.amount }}</label>
        <input
          v-model="amount"
          :placeholder="EXPENSE_COPY.amountPlaceholder"
          name="amount"
          type="number"
        />
      </div>

      <!-- DATE PICKER -->
      <div class="input-group">
        <DatePicker id="datePicker" @on-change="onDateSelect" />
      </div>

      <button @click="onAddExpense">{{ COMMON_COPY.add }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { COMMON_COPY, EXPENSE_COPY } from '~~/constants/copy'
import { HOME_ROUTE } from '~~/constants/routes/home'
import { DATE_FORMAT } from '~~/helpers/dateTimeHelper'
import { createExpense } from '~~/endpoints/expense'
import { useAccount } from '~~/stores/account'
import { INewExpense } from '~~/types/expense'

const emit = defineEmits(['createdExpense'])

const router = useRouter()
const account = useAccount()

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

const onAddExpense = async (event: Event) => {
  event.preventDefault()

  if (!account.userId) return

  const expenseData: INewExpense = {
    userId: account.userId,
    note: note.value,
    amount: amount.value,
    date: date.value,
  }

  await createExpense(expenseData)
  alert('Added expense')
  emit('createdExpense')
}
</script>
