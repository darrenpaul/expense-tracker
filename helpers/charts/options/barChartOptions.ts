export interface IBarChartOptions {
  chartType: string
  title: {
    text: string
    left: string
  }
  tooltip: {
    trigger: string
    axisPointer: {
      type: string
    }
    valueFormatter: Function
  }
  legend: {
    left: string
    bottom: string
    type: string
  }
  xAxis?: Array<Object>
  yAxis: Array<Object>
  series?: Array<Object>
}

export const barChartBaseOptions: IBarChartOptions = {
  chartType: 'bar',
  title: {
    text: '',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    valueFormatter: (value: number) => value,
  },
  legend: {
    left: 'center',
    bottom: '5%',
    type: 'scroll',
  },
  yAxis: [
    {
      type: 'value',
    },
  ],
}

interface ICreateBarSeriesObject {
  name: string
  data: Array<any>
}
export const createBarSeriesObject = ({
  data,
  name,
}: ICreateBarSeriesObject) => {
  return {
    name,
    type: 'bar',
    data,
  }
}

export const createBarXAxisObject = (data = [], type = 'category') => {
  return {
    type,
    data,
    axisTick: {
      alignWithLabel: true,
    },
  }
}
