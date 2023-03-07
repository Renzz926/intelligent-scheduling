import { getDprSize } from "@/utils/utils";
import { formatAmount } from "@/utils/format";

const BASE_CONFIG = {
  legend: {
    top: getDprSize(9),
    itemWidth: getDprSize(10),
    itemHeight: getDprSize(10),
    textStyle: {
      fontSize: getDprSize(10),
      color: '#000',
    }
  },
  xAxis: {
    axisTick: { show: false },
    axisLabel: {
      color: '#000',
      fontSize: getDprSize(12),
      interval: 0,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#000',
      },
    }
  },
  yAxis: {
    nameTextStyle: {
      color: '#000',
      align: 'center',
      fontSize: getDprSize(12),
    },
    axisLabel: {
      color: '#000',
      fontSize: getDprSize(12),
      interval: 0,
      formatter: v => formatAmount(Math.ceil(v)),
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#000',
      },
    },
    splitLine: {
      show: false,
    },
    splitNumber: 3,
    max: 'dataMax',
  },
  grid: {
    show: false,
    left: 0,
    right: 0,
    bottom: 0,
    top: getDprSize(23),
    containLabel: true,
  },
  barsSeries: {
    barWidth: getDprSize(8),
    barGap: '30%'
  }
}
export default BASE_CONFIG;