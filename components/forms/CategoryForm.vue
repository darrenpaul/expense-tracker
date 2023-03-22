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
      </div>

      <div class="input-group">
        <div class="input-label-container">
          <label for="account">Icon</label>
        </div>

        <div class="flex flex-wrap">
          <button
            v-for="categoryIcon in CATEGORY_ICONS"
            :key="categoryIcon.label"
            :class="[
              'w-10 h-10 flex items-center justify-center',
              categoryIcon.value === icon ? 'bg-yellow-300' : '',
            ]"
            @click="() => onIconClick(categoryIcon.value)"
          >
            <component :is="categoryIcon.component" :size="'32'" />
          </button>
        </div>
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
import { INewCategory, ICategory } from '~~/types/category'
import { TRANSACTION_TYPES } from '~~/constants/transactions'
import { useNotification } from '~~/stores/notification'
import TrashIcon from '~~/components/icons/TrashIcon.vue'
import { CATEGORY_ICONS } from '~~/constants/category'

const emit = defineEmits(['closeModal', 'onCreate', 'onUpdate', 'onDelete'])

const props = defineProps({
  category: { type: Object, default: () => {} },
})

const profile = useProfile()
const notification = useNotification()

const name = ref(props.category.name || '')
const icon = ref(props.category.icon)
const transactionType = ref(
  props.category.transactionType || TRANSACTION_TYPES[0].displayName
)

const headingCopy = computed(() => {
  if (isEmpty(props.category)) {
    return CATEGORY_COPY.addCategory
  }
  return CATEGORY_COPY.editCategory
})

const onIconClick = (value: string) => {
  event?.preventDefault()
  icon.value = value
}

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
    transactionType.value === props.category.transactionType &&
    name.value === props.category.name &&
    transactionType.value === props.category.transactionType &&
    icon.value === props.category.icon
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
      icon: icon.value,
    }

    emit('onUpdate', data)
  } else {
    const data: INewCategory = {
      userId: profile.userId,
      transactionType: transactionType.value,
      name: name.value.trim(),
      icon: icon.value,
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
