<template>
  <div>
    <div class="flex between mb-2">
      <h3>{{ headingCopy }}</h3>
    </div>

    <form>
      <!-- NAME -->
      <div class="input-group">
        <label class="label" for="budgetName">{{
          BUDGET_COPY.budgetName
        }}</label>

        <input
          v-model="name"
          class="input"
          :placeholder="BUDGET_COPY.budgetNamePlaceholder"
          name="budgetName"
          type="text"
        />
      </div>

      <!-- CATEGORY -->
      <div class="input-group">
        <label class="label" for="category">{{ BUDGET_COPY.category }}</label>

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
        <label class="label" for="amount">{{ BUDGET_COPY.amount }}</label>

        <input
          id="amount"
          v-model="amount"
          class="input"
          :placeholder="BUDGET_COPY.amountPlaceholder"
          name="amount"
          pattern="[0-9]*"
          type="text"
        />
      </div>

      <!-- START DATE -->
      <div class="input-groups">
        <div class="input-group">
          <label class="label" for="datePickerStartDate">{{
            BUDGET_COPY.startDate
          }}</label>

          <DatePicker
            id="datePickerStartDate"
            :date="startDate"
            @on-change="startDate = $event"
          />
        </div>

        <!-- END DATE -->
        <div class="input-group">
          <label class="label" for="datePickerEndDate">{{
            BUDGET_COPY.endDate
          }}</label>

          <DatePicker
            id="datePickerEndDate"
            :date="endDate"
            @on-change="endDate = $event"
          />
        </div>
      </div>

      <!-- NOTE -->
      <div class="input-group">
        <label class="label" for="note">{{ BUDGET_COPY.note }}</label>

        <textarea
          id="note"
          v-model="note"
          class="textarea"
          :placeholder="BUDGET_COPY.notePlaceholder"
          name="note"
          type="text"
        />
      </div>

      <!-- BUTTONS -->
      <div>
        <button
          v-if="!isEmpty(props.budget)"
          class="button-warn"
          type="button"
          @click="onShowConfirmDialog"
        >
          {{ BUDGET_COPY.delete }}
        </button>

        <CancelSaveButtons @on-cancel="onCancel" @on-save="onAddUpdateBudget" />
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
