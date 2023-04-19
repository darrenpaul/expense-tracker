<template>
  <div>
    <div class="flex between mb-2">
      <h3>{{ headingCopy }}</h3>
    </div>

    <form>
      <!-- NAME -->
      <div class="input-group">
        <label class="label" for="name">{{ COMMON_COPY.goalName }}</label>

        <input
          id="name"
          v-model="name"
          class="input"
          :placeholder="COMMON_COPY.goalNamePlaceholder"
          name="name"
          type="text"
        />
      </div>

      <!-- AMOUNT -->
      <div class="input-group">
        <label class="label" for="amount">{{ TRANSACTION_COPY.amount }}</label>

        <input
          id="amount"
          v-model="amount"
          :placeholder="TRANSACTION_COPY.amountPlaceholder"
          name="amount"
          pattern="[0-9]*"
          class="input"
          type="text"
        />
      </div>

      <!-- DATE PICKER -->
      <div class="input-group">
        <label class="label" for="datePicker">{{
          COMMON_COPY.targetDate
        }}</label>
        <DatePicker id="datePicker" :date="date" @on-change="date = $event" />
      </div>

      <!-- NOTE -->
      <div class="input-group">
        <label class="label" for="note">{{ TRANSACTION_COPY.note }}</label>

        <textarea
          id="note"
          v-model="note"
          :placeholder="TRANSACTION_COPY.notePlaceholder"
          name="note"
          class="textarea"
          type="text"
        />
      </div>

      <div>
        <button
          v-if="!isEmpty(props.goal)"
          class="button-warn"
          type="button"
          @click="onShowConfirmDialog"
        >
          {{ COPY.delete }}
        </button>
        <!-- BUTTONS -->
        <CancelSaveButtons @on-cancel="onCancel" @on-save="onAddUpdateGoal" />
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
// COMPONENTS
import ConfirmDialog from '~~/components/dialogs/ConfirmDialog.vue'
// CONSTANTS
import { COMMON_COPY, TRANSACTION_COPY } from '~~/constants/copy'
import COPY from '~~/constants/copy/goals'
import { validateName } from '~~/helpers/validators'
import { DATE_TIME_FORMAT } from '~~/helpers/dateTimeHelper'
import { useProfile } from '~~/stores/profile'
import { useGoals } from '~~/stores/goals'
import { IGoal, INewGoal } from '~~/types/goal'

const emit = defineEmits(['closeModal'])

const props = defineProps({
  goal: { type: Object, default: () => {} },
})

const profile = useProfile()
const goalStore = useGoals()

const name = ref(props.goal?.name || '')
const amount = ref(props.goal?.amount)
const date = ref(props.goal?.date || format(new Date(), DATE_TIME_FORMAT))
const note = ref(props.goal?.note || '')
const showConfirmDialog = ref(false)

const headingCopy = computed(() => {
  if (isEmpty(props.goal)) {
    return COMMON_COPY.addGoal
  }
  return COMMON_COPY.editGoal
})

const fieldsValid = () => {
  if (!profile.authenticated) return false

  // ACCOUNT NAME
  if (validateName(name.value) === false) return false

  return true
}

const onShowConfirmDialog = () => {
  showConfirmDialog.value = true
}

const onCloseConfirmDialog = () => {
  showConfirmDialog.value = false
}

const onConfirmConfirmDialog = () => {
  showConfirmDialog.value = false
  onDeleteGoal()
}

const onCancel = () => {
  emit('closeModal')
}

const onAddUpdateGoal = () => {
  if (fieldsValid() === false) {
    return false
  }

  // UPDATE
  if (props.goal?.name) {
    const data: IGoal = {
      id: props.goal?.id,
      name: name.value,
      amount: amount.value,
      date: date.value,
      note: note.value,
    }

    goalStore.handleUpdateGoal(data)
  }

  // CREATE
  if (!props.goal?.name) {
    const data: INewGoal = {
      userId: profile.userId,
      name: name.value,
      amount: amount.value,
      date: date.value,
      note: note.value,
    }
    goalStore.handleCreateGoal(data)
  }

  emit('closeModal')
}

const onDeleteGoal = async () => {
  const { id } = props.goal
  goalStore.handleDeleteGoal(id)

  emit('closeModal')
}
</script>
