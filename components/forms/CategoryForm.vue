<template>
  <div>
    <div class="row between mb-4">
      <h2>{{ headingCopy }}</h2>
      <button
        v-if="!isEmpty(props.category)"
        class="button-icon-danger"
        @click="onCategoryDelete"
      >
        <TrashIcon />
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
  </div>
</template>

<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import CancelSaveButtons from '~~/components/CancelSaveButtons.vue'
import { COMMON_COPY, CATEGORY_COPY } from '~~/constants/copy'
import { useProfile } from '~~/stores/profile'
import { createCategory, updateCategory } from '~~/endpoints/category'
import { INewCategory, ICategory } from '~~/types/category'
import { useCategories } from '~~/stores/categories'
import { TRANSACTION_TYPES } from '~~/constants/transactions'
import { useNotification } from '~~/stores/notification'
import TrashIcon from '~~/components/icons/TrashIcon.vue'

const emit = defineEmits(['closeModal', 'onCreate', 'onUpdate', 'onDelete'])

const props = defineProps({
  category: { type: Object, default: () => {} },
})

const profile = useProfile()
const notification = useNotification()

const name = ref(props.category.name || '')
const nameError = ref('')
const transactionType = ref(
  props.category.transactionType || TRANSACTION_TYPES[0].displayName
)

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
      name: name.value.trim(),
      icon: '',
    }

    emit('onUpdate', data)
  } else {
    const data: INewCategory = {
      userId: profile.userId,
      transactionType: transactionType.value,
      name: name.value.trim(),
      icon: '',
    }

    emit('onCreate', data)
  }

  emit('closeModal')
}

const onCategoryDelete = () => {
  const categoryId = props.category.id
  emit('onDelete', categoryId)
}
</script>
