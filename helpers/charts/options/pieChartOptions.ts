import { chartEmphasisOptions } from './emphasisOptions'

export interface IPieChartOptions {
  chartType: string
  title: {
    text: string
    left: string
  }
  tooltip: {
    trigger: string
    valueFormatter: Function
  }
  legend: {
    left: string
    bottom: string
  }
  series?: Array<Object>
}

export const pieChartBaseOptions: IPieChartOptions = {
  chartType: 'pie',
  title: {
    text: '',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    valueFormatter: (value: number) => value,
  },
  legend: {
    left: 'center',
    bottom: '5%',
  },
}

export const createPieSeriesObject = (data: any) => {
  return {
    type: 'pie',
    radius: ['40%', '70%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 10,
      borderColor: '#fff',
      borderWidth: 2,
    },
    emphasis: chartEmphasisOptions,
    label: {
      show: false,
    },
    data,
  }
}
