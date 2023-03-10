<template>
  <div>
    <div class="row between">
      <h2>{{ headingCopy }}</h2>
      <button
        v-if="!isEmpty(props.budget)"
        class="button-icon"
        @click="onShowConfirmDialog"
      >
        <TrashIcon :size="'20'" />
      </button>
    </div>

    <form>
      <!-- NAME -->
      <div class="input-group">
        <label for="name">{{ COMMON_COPY.budgetName }}</label>
        <input
          v-model="name"
          :placeholder="COMMON_COPY.budgetNamePlaceholder"
          name="name"
          type="text"
        />
      </div>

      <!-- CATEGORY -->
      <div class="input-group">
        <label for="category">{{ TRANSACTION_COPY.category }}</label>

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
        <label for="amount">{{ TRANSACTION_COPY.amount }}</label>
        <input v-model="amount" name="amount" type="number" />
      </div>

      <!-- DATE PICKER -->
      <div class="row">
        <!-- START DATE -->
        <div class="input-group">
          <label for="datePickerStartDate">{{ COMMON_COPY.startDate }}</label>
          <DatePicker
            id="datePickerStartDate"
            :date="startDate"
            @on-change="startDate = $event"
          />
        </div>

        <!-- END DATE -->
        <div class="input-group">
          <label for="datePickerEndDate">{{ COMMON_COPY.endDate }}</label>
          <DatePicker
            id="datePickerEndDate"
            :date="endDate"
            @on-change="endDate = $event"
          />
        </div>
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

      <div class="row">
        <button class="button button-secondary" @click="onCancel">
          {{ COMMON_COPY.cancel }}
        </button>
        <button class="button" @click="onAddUpdateBudget">
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
import ConfirmDialog from '~~/components/dialogs/ConfirmDialog.vue'
import TrashIcon from '~~/components/icons/TrashIcon.vue'
import { COMMON_COPY, TRANSACTION_COPY } from '~~/constants/copy'
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
const amount = ref(props.budget?.amount || 0.0)
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
    return COMMON_COPY.addBudget
  }
  return COMMON_COPY.editBudget
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
  event.preventDefault()
  emit('closeModal')
}

const onAddUpdateBudget = async (event: Event) => {
  event.preventDefault()

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
