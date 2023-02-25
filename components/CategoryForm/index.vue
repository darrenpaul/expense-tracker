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
      </div>

      <button @click="onAddCategory">{{ COMMON_COPY.add }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import BasicRadio from '../radios/BasicRadio.vue'
import { COMMON_COPY, CATEGORY_COPY, TRANSACTION_COPY } from '~~/constants/copy'
import { useAccount } from '~~/stores/account'
import { createCategory } from '~~/endpoints/category'
import { INewCategory } from '~~/types/category'
import { useCategories } from '~~/stores/categories'
import { TRANSACTION_TYPES } from '~~/constants/transactions'

const emit = defineEmits(['createdCategory'])

const account = useAccount()
const categories = useCategories()

const name = ref('')
const transactionType = ref(TRANSACTION_TYPES[0].displayName)

const onAddCategory = async (event: Event) => {
  event.preventDefault()

  if (!account.userId) return

  const data: INewCategory = {
    userId: account.userId,
    transactionType: transactionType.value,
    displayName: name.value,
    icon: '',
  }

  await createCategory(data)
  categories.fetchCategories()

  alert('Added category')
  emit('createdCategory')
}
</script>
