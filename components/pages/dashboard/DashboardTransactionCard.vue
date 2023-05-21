<template>
  <div>
    <div class="card !py-2 flex items-center gap-4 !bg-secondary-a">
      <template v-if="transaction.category">
        <template
          v-for="categoryIcon in CATEGORY_ICONS"
          :key="categoryIcon.label"
        >
          <component
            :is="categoryIcon.component"
            v-if="transaction.category.icon === categoryIcon.value"
            :size="'32'"
          />
        </template>
      </template>

      <div class="flex flex-col w-full">
        <div class="flex w-full justify-between items-center">
          <h4 class="truncate">{{ props.transaction.name }}</h4>
          <small>{{
            format(new Date(props.transaction.date), 'dd MMM')
          }}</small>
        </div>

        <h4 :class="textColor">
          <b>
            {{
              currencyFormat({
                value: props.transaction.amount,
                currency: userSettingStore.currency,
              })
            }}
          </b>
        </h4>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ITransaction } from '~~/types/transaction'
import { useUserSettings } from '~~/stores/userSettings'
import { currencyFormat } from '~~/helpers/formatting'
import { TRANSACTION_TYPE_EXPENSE } from '~~/constants/transactions'
import { CATEGORY_ICONS } from '~~/constants/category'

const props = defineProps<{ transaction: ITransaction }>()

const userSettingStore = useUserSettings()

const textColor = computed(() => {
  if (props.transaction.type === TRANSACTION_TYPE_EXPENSE.displayName) {
    return 'text-app-red'
  }

  return 'text-app-green'
})
</script>
