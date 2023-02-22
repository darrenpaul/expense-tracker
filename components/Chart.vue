<template>
  <div>
    <div ref="chartElement" :style="{ width: '100vw', height: '80vh' }" />
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'

const props = defineProps({
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

watch(props, () => {
  myChart.value.setOption(props.options)
})
</script>
