import { getDprSize } from "./utils";

const BASE_CONFIG = {
  // 默认地图底色
  defaultMapAreaColor: 'rgba(29, 98, 69, 0.56)', 
  // 默认地图区域边框颜色
  defaultMapBorderColor: 'rgba(255, 255, 255, 0.4)',
  
  visual: {
    piecewise: {
      hoverLink: false,
      align: 'left',
      textStyle: {
        color: '#000',
        fontSize: getDprSize(12),
      },
      itemWidth: getDprSize(20),
      itemHeight: getDprSize(12),
      itemSymbol: 'rect',
    },
    continuous: {
      min: 1,
      calculable: false,
      hoverLink: false,
      align: 'top',
    }
  },
  geo: {
    layoutCenter: ['50%', '50%'],
    layoutSize: '150%',
    aspectScale: 0.9,
    zoom: 0.65,
  },
  // 地图区域名称基础样式
  areaNameScatter: {
    label: {
      show: true,
      formatter: '{b}',
      position: 'right',
      color: '#000',
      fontSize: 12,
      fontWeight: 600,
      distance: 5,
    },
    itemStyle: {
      color: '#000'
    },
    symbolSize: 8,
    symbolOffset: ['-50%',0],
  },
  scatter: {
    symbolSize: 8,
    label: {
      show: false,
    },
    itemStyle: {
      color: 'rgba(255,150,100,1)',
    },
    emphasis: {
      scale: 2,
      label: {
        show: false,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter(params) {
        return `${params.name} : ${params.value[2]}`;
      },
    }
  }
}
export default BASE_CONFIG;