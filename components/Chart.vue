<template>
  <div class="w-full">
    <div
      ref="chartElement"
      :style="{ width: props.width, height: props.height }"
    />
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '80vh' },
  options: {
    type: Object,
    default: () => {},
  },
})

const chartElement = ref()
const myChart = shallowRef()

onMounted(() => {
  myChart.value = echarts.init(chartElement.value)

  myChart.value.setOption(props.options)
})

watch(
  () => props.options,
  (newOptions, oldOptions) => {
    if (newOptions?.chartType !== oldOptions?.chartType) {
      myChart.value.clear()
    }
    myChart.value.setOption(props.options)
  }
)
</script>
