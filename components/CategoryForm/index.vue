<template>
  <div>
    <h1>{{ CATEGORY_COPY.addCategory }}</h1>
    <form>
      <div class="input-group">
        <label for="displayName">{{ TRANSACTION_COPY.transactionType }}</label>
        <ul id="transactionTypeRadio" class="radio-buttons-container-column">
          <BasicRadio
            v-for="{ id, displayName } in TRANSACTION_TYPES"
            :key="id"
            :element-id="`categoryFormTransactionType-${id}`"
            :element-name="'categoryFormTransactionType'"
            :value="displayName"
            :selected="transactionType"
            :label-text="displayName"
            @change="(value:string) => transactionType = value"
          />
        </ul>
      </div>

      <!-- NAME -->
      <div class="input-group">
        <label for="name">{{ CATEGORY_COPY.category }}</label>
        <input
          v-model="name"
          :placeholder="CATEGORY_COPY.categoryPlaceholder"
          name="name"
          type="text"
        />
        <small>{{ nameError }}</small>
      </div>

      <div class="column">
        <button class="button-secondary" @click="onCancel">
          {{ COMMON_COPY.cancel }}
        </button>
        <button @click="onAddCategory">{{ COMMON_COPY.save }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import BasicRadio from '../radios/BasicRadio.vue'
import { COMMON_COPY, CATEGORY_COPY, TRANSACTION_COPY } from '~~/constants/copy'
import { useAccount } from '~~/stores/account'
import { createCategory, updateCategory } from '~~/endpoints/category'
import { INewCategory, ICategory } from '~~/types/category'
import { useCategories } from '~~/stores/categories'
import { TRANSACTION_TYPES } from '~~/constants/transactions'
import { useNotification } from '~~/stores/notification'

const emit = defineEmits(['closeModal'])

const props = defineProps({
  category: { type: Object, default: () => {} },
})

const account = useAccount()
const categories = useCategories()
const notification = useNotification()

const name = ref(props.category.name || '')
const nameError = ref('')
const transactionType = ref(
  props.category.transactionType || TRANSACTION_TYPES[0].displayName
)

const validateCategory = () => {
  if (name.value === '' || name.value === null || name.value === undefined) {
    return false
  }
  return true
}

const onCancel = (event: Event) => {
  event.preventDefault()
  emit('closeModal')
}

const onAddCategory = async (event: Event) => {
  event.preventDefault()

  if (name.value === '' || name.value === null || name.value === undefined) {
    notification.addNotification({
      title: 'Notification Title',
      message: CATEGORY_COPY.categoryNameError,
      type: 'error',
    })
    return
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
    return
  }

  if (!account.userId) return

  if (props.category) {
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
      userId: account.userId,
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
</script>
