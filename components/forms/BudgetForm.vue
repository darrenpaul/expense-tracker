<template>
  <div>
    <div class="row between mb-4">
      <h2>{{ headingCopy }}</h2>

      <button
        v-if="!isEmpty(props.budget)"
        class="button-icon"
        @click="onShowConfirmDialog"
      >
        <TrashIcon />
      </button>
    </div>

    <form>
      <!-- NAME -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="name">{{ BUDGET_COPY.budgetName }}</label>
        </div>
        <input
          v-model="name"
          :placeholder="BUDGET_COPY.budgetNamePlaceholder"
          name="name"
          type="text"
        />
      </div>

      <!-- CATEGORY -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="category">{{ BUDGET_COPY.category }}</label>
        </div>

        <Dropdown
          v-model="categoryIds"
          :options="dropdownOptions"
          :selected="categoryIds"
          :multiple="true"
          @selection-updated="categoryIds = $event"
        />
      </div>

      <!-- AMOUNT -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="amount">{{ BUDGET_COPY.amount }}</label>
        </div>

        <input
          id="amount"
          v-model="amount"
          :placeholder="BUDGET_COPY.amountPlaceholder"
          name="amount"
          pattern="[0-9]*"
          type="text"
        />
      </div>

      <!-- START DATE -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="datePickerStartDate">{{ BUDGET_COPY.startDate }}</label>
        </div>
        <DatePicker
          id="datePickerStartDate"
          :date="startDate"
          @on-change="startDate = $event"
        />
      </div>

      <!-- END DATE -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="datePickerEndDate">{{ BUDGET_COPY.endDate }}</label>
        </div>
        <DatePicker
          id="datePickerEndDate"
          :date="endDate"
          @on-change="endDate = $event"
        />
      </div>

      <!-- NOTE -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="note">{{ BUDGET_COPY.note }}</label>
        </div>
        <textarea
          id="note"
          v-model="note"
          :placeholder="BUDGET_COPY.notePlaceholder"
          name="note"
          type="text"
        />
      </div>

      <!-- BUTTONS -->
      <CancelSaveButtons @on-cancel="onCancel" @on-save="onAddUpdateBudget" />
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
import BUDGET_COPY from '~~/constants/copy/budget'
import CancelSaveButtons from '~~/components/CancelSaveButtons.vue'
import ConfirmDialog from '~~/components/dialogs/ConfirmDialog.vue'
import TrashIcon from '~~/components/icons/TrashIcon.vue'
import { validateName } from '~~/helpers/validators'
import { DATE_TIME_FORMAT } from '~~/helpers/dateTimeHelper'
import { useProfile } from '~~/stores/profile'
import { useCategories } from '~~/stores/categories'
import { IBudget, INewBudget } from '~~/types/budget'
import Dropdown from '~~/components/Dropdown/index.vue'
import { useBudgets } from '~~/stores/budgets'

const emit = defineEmits(['closeModal'])

const props = defineProps({
  budget: { type: Object, default: () => {} },
})

const profile = useProfile()
const categoryStore = useCategories()
const budgetStore = useBudgets()

const name = ref(props.budget?.name || '')
const amount = ref(props.budget?.amount)
const categoryIds = ref(props.budget?.categoryIds || [])
const startDate = ref(
  props.budget?.startDate || format(new Date(), DATE_TIME_FORMAT)
)
const endDate = ref(
  props.budget?.endDate || format(new Date(), DATE_TIME_FORMAT)
)
const note = ref(props.budget?.note || '')
const showConfirmDialog = ref(false)

const headingCopy = computed(() => {
  if (isEmpty(props.budget)) {
    return BUDGET_COPY.addBudget
  }
  return BUDGET_COPY.editBudget
})

const dropdownOptions = computed(() => {
  return categoryStore.categories.map(({ id, name }) => ({
    value: id,
    label: name,
  }))
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
  onDeleteBudget()
}

const onCancel = () => {
  emit('closeModal')
}

const onAddUpdateBudget = () => {
  if (fieldsValid() === false) {
    return false
  }

  // UPDATE
  if (props.budget?.name) {
    const data: IBudget = {
      id: props.budget?.id,
      categoryIds: categoryIds.value,
      name: name.value,
      amount: amount.value,
      startDate: startDate.value,
      endDate: endDate.value,
      note: note.value,
    }

    budgetStore.handleUpdateBudget(data)
  }

  // CREATE
  if (!props.budget?.name) {
    const data: INewBudget = {
      userId: profile.userId,
      name: name.value,
      categoryIds: categoryIds.value,
      amount: amount.value,
      startDate: startDate.value,
      endDate: endDate.value,
      note: note.value,
    }
    budgetStore.handleCreateBudget(data)
  }

  emit('closeModal')
}

const onDeleteBudget = () => {
  const { id } = props.budget
  budgetStore.handleDeleteBudget(id)

  emit('closeModal')
}
</script>
