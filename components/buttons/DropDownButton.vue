<template>
  <div class="dropdown-button-container">
    <button :class="[buttonStyle]" @click="emit('toggleIsOpen', !props.isOpen)">
      <div class="flex items-center justify-between gap-4 truncate">
        {{ buttonText }}

        <ArrowDownIcon v-if="isOpen" :size="'12'" />
        <ArrowUpIcon v-else :size="'12'" />
      </div>
    </button>

    <div v-if="props.isOpen" class="dropdown-button-content">
      <div>
        <slot name="dropdownButtons"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowDownIcon from '~~/components/icons/ArrowDownIcon.vue'
import ArrowUpIcon from '~~/components/icons/ArrowUpIcon.vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  buttonText: { type: String, default: '' },
  buttonStyle: { type: String, default: 'button-small' },
})

const emit = defineEmits(['toggleIsOpen'])

const isActive = ref(props.isOpen)

const router = useRouter()
router.beforeEach(() => {
  isActive.value = false
})
</script>

<style lang="scss" scoped>
@import './dropdownButton.scss';
</style>
