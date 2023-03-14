<template>
  <div>
    <div class="row between mb-4">
      <h2>{{ headingCopy }}</h2>
      <button
        v-if="!isEmpty(props.category)"
        class="button-icon"
        @click="onShowConfirmDialog"
      >
        <TrashIcon :size="'20'" />
      </button>
    </div>

    <form>
      <!-- TRANSACTION TYPE -->
      <TransactionTypeSelect
        :selected="transactionType"
        @on-change="transactionType = $event"
      />

      <!-- NAME -->
      <div class="input-group">
        <div class="input-label-container">
          <label for="name">{{ CATEGORY_COPY.name }}</label>
        </div>
        <input
          v-model="name"
          :placeholder="CATEGORY_COPY.categoryPlaceholder"
          name="name"
          type="text"
        />
        <small>{{ nameError }}</small>
      </div>

      <!-- BUTTONS -->
      <CancelSaveButtons @on-cancel="onCancel" @on-save="onAddCategory" />
    </form>

    <ConfirmDialog
      :show="showConfirmDialog"
      @close-modal="onCloseConfirmDialog"
      @confirm="onConfirmConfirmDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import CancelSaveButtons from '~~/components/CancelSaveButtons.vue'
import { COMMON_COPY, CATEGORY_COPY, TRANSACTION_COPY } from '~~/constants/copy'
import { useProfile } from '~~/stores/profile'
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '~~/endpoints/category'
import { INewCategory, ICategory } from '~~/types/category'
import { useCategories } from '~~/stores/categories'
import { TRANSACTION_TYPES } from '~~/constants/transactions'
import { useNotification } from '~~/stores/notification'
import ConfirmDialog from '~~/components/dialogs/ConfirmDialog.vue'
import TrashIcon from '~~/components/icons/TrashIcon.vue'

const emit = defineEmits(['closeModal'])

const props = defineProps({
  category: { type: Object, default: () => {} },
})

const profile = useProfile()
const categories = useCategories()
const notification = useNotification()

const name = ref(props.category.name || '')
const nameError = ref('')
const transactionType = ref(
  props.category.transactionType || TRANSACTION_TYPES[0].displayName
)
const showConfirmDialog = ref(false)

const headingCopy = computed(() => {
  if (isEmpty(props.category)) {
    return CATEGORY_COPY.addCategory
  }
  return CATEGORY_COPY.editCategory
})

const fieldsValid = () => {
  if (name.value === '' || name.value === null || name.value === undefined) {
    notification.addNotification({
      title: 'Notification Title',
      message: CATEGORY_COPY.categoryNameError,
      type: 'error',
    })
    return false
  }

  if (
    name.value === props.category.name &&
    transactionType.value === props.category.transactionType
  ) {
    notification.addNotification({
      title: 'Notification Title',
      message: COMMON_COPY.noChanges,
      type: 'error',
    })
    return false
  }
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
  onCategoryDelete()
}

const onCancel = () => {
  emit('closeModal')
}

const onAddCategory = async () => {
  if (fieldsValid() === false) {
    return false
  }
  if (!profile.userId) return

  if (props.category.name) {
    const data: ICategory = {
      id: props.category.id,
      transactionType: transactionType.value,
      name: name.value,
      icon: '',
    }

    await updateCategory(data)
    notification.addNotification({
      title: 'Notification Title',
      message: CATEGORY_COPY.categoryUpdated,
      type: 'success',
    })
  } else {
    const data: INewCategory = {
      userId: profile.userId,
      transactionType: transactionType.value,
      name: name.value,
      icon: '',
    }

    await createCategory(data)
    notification.addNotification({
      title: 'Notification Title',
      message: CATEGORY_COPY.categoryAdded,
      type: 'success',
    })
  }
  categories.fetchCategories()

  emit('closeModal')
}

const onCategoryDelete = async () => {
  const categoryId = props.category.id
  await deleteCategory(categoryId)
  categories.fetchCategories()

  emit('closeModal')
}
</script>
