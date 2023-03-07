import BASE_CONFIG from "./config";

export function getDprSize(fontSize) {
  let deviceWidth = document.documentElement.clientWidth;
  const tmpWidth = (document.documentElement.clientHeight * 1600) / 900;
  const designRes = window.screen.width * 9 === window.screen.height * 16; // 实际分辨率
  if (!designRes && window.screen.width * 10 === window.screen.height * 16) {
    // 屏幕分辨率为16：10
    deviceWidth = (document.documentElement.clientWidth * 9) / 10;
  }
  deviceWidth = deviceWidth < tmpWidth ? deviceWidth : tmpWidth;
  return Math.floor((deviceWidth * fontSize) / 1600);
}

/**
 * 空数组
 * @param {*} arr
 */
 export function isEmptyArray(arr) {
  if (arr instanceof Array && arr.length > 0) {
    return false;
  }
  return true;
}

/**
 * 空对象
 * @param {*} Object
 */
 export function isEmptyObject(obj) {
  if (!obj) {
    return true;
  }
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    if (Object.keys(obj).length === 0) {
      return true;
    }
    return false;
  }
  return false;
}

// todo 3D地图配置备份
// export function getBaseMapSeries(params) {
//   const {
//     data = [],
//     viewMode = 'plane',
//     mapName = '330000',
//     texture = false,
//     textureImg = '',
//     geo = {}
//   } = params;
//   let ret;
//   console.log('data',data);
//   data.map(item=>{
//     console.log(item);
//   })
//   if (viewMode === '3D') {
//     ret = {
//       name: '地区',
//       type: 'map3D',
//       map: mapName,
//       boxDepth: 90,
//       itemStyle: {
//         color: 'rgba(70, 144, 40, .5)',
//         borderWidth: 1,
//         borderColor: "#000", //省市边界线
//       },
//       emphasis: {
//         itemStyle: {
//           color: 'rgba(188, 189, 69, 0.5)',
//         },
//       }
//     }
//   }else{
//     ret = {
//       name: '地区',
//       type: 'map',
//       map: mapName,
//       ...BASE_CONFIG.geo,
//       ...geo,
//       itemStyle: {
//         // 地图纹理样式
//         areaColor: texture ? {
//           image: textureImg,
//           repeat: 'repeat',
//         } : BASE_CONFIG.defaultMapAreaColor,
//       },
//       data: data.map(item=>{
//         return {
//           name: item.name,
//           value: item.value,
//           itemValue: item,
//           label: { show: false },
//           select: { disabled: true },
//           emphasis: {
//             disabled: true,
//             label: { show: false },
//           },
//           ...map,
//           itemStyle: {
//             color: item?.visualMapColor?.emphasisColor || 'rgba(29, 98, 69, 0.56)',
//             borderColor: BASE_CONFIG.defaultMapBorderColor,
//             borderWidth: 1,
//           },
//         };
//       }),
//     }
//   }
//   return ret
// }

/**
 * 获取对应类型visualMap配置
 * @param {*} params 区域编码
 * @param {*} index seriesIndex值
 */
export function getVisualMapConfig(data,params,index,style) {
  const {
    type = '',
    config = {},
  } = params;
  let ret;
  switch (type) {
    case 'piecewise':
      ret = {
        type: 'piecewise',
        seriesIndex: index,
        ...BASE_CONFIG.visual.piecewise,
        ...config,
        ...style
      }
      break;
    case 'continuous':
      ret = {
        type: 'continuous',
        seriesIndex: index,
        max: data?.length || 0,
        ...BASE_CONFIG.visual.continuous,
        ...config,
        ...style
      }
      break;
    default:
      break;
  }
  return ret;
}

/**
 * 获取scatter 散点配置
 */
export function getScatterConfig(data = [], style,scatterTooltip) {
  return {
    name: '企业情况',
    type: 'scatter',
    coordinateSystem: 'geo',
    data,
    ...BASE_CONFIG.scatter,
    ...scatterTooltip,
    ...style
  };
}

/**
 * 获取label配置
 */
 export function getLabelConfig(data = [], style,labelTooltip) {
  return {
    name: '地区数值',
    type: 'scatter',
    coordinateSystem: 'geo',
    symbolSize: 0,
    data,
    tooltip: {
      show: false,
    },
    label: {
      formatter: (params) => {
        return params.data.value[2];
      },
      show: true,
      color: '#fff',
      fontSize: getDprSize(16),
      fontWeight: 600,
      padding: [2, 10],
      backgroundColor: 'rgba(14, 14, 14, 0.5)',
      borderRadius: 4,
    },
    ...style,
    ...labelTooltip
  }
}

/**
 * 设置区域对应颜色
 */
export function getVisualMapColor(params) {
  const {
    val = '',
    visualMap = null,
    mapDataLength = 0,
    countySplicing = false,
    areaName = ''
  } = params;

  let colorObj = {};

  if (!visualMap || !visualMap?.show || isEmptyArray(visualMap?.config?.pieces) || isEmptyArray(visualMap?.config?.areaColorMap)) {
    return colorObj
  }
  const cityArr = ['丽水市', '湖州市', '绍兴市', '温州市', '台州市', '舟山市', '嘉兴市', '金华市', '杭州市', '衢州市', '宁波市'];
  if(countySplicing && cityArr.includes(areaName)) {
    return {
      borderColor: 'rgba(255, 255, 255, 0)',
      emphasisBorderColor: 'rgba(255, 255, 255, 0)',
      emphasisColor: 'rgba(255, 255, 255, 0)',
    };
  }

  const arr = visualMap?.config?.pieces;
  const areaColorMap = visualMap?.config?.areaColorMap;

  const contrastNum = visualMap?.type === 'piecewise' ? Number(val) : Number(val/mapDataLength*100);

  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].gt && !arr[i].lte && contrastNum > arr[i].gt) {
      colorObj = areaColorMap[i];
      break;
    }

    if (arr[i].gt && arr[i].lte && contrastNum > arr[i].gt && contrastNum <= arr[i].lte) {
      colorObj = areaColorMap[i];
      break;
    }

    if (!arr[i].gt && arr[i].lte && contrastNum <= arr[i].lte) {
      colorObj = areaColorMap[i];
      break;
    }
  }

  return colorObj;
}

export const getPosition = (position, dom) => {
  let pixel = getPixelByConvert(dom, position);
  const convert = getConvertByPixel(dom, pixel);
  return convert;
}

export const getLabelValue = (position, value, dom) => {
  let pixel = getPixelByConvert(dom, position);
  pixel = [pixel?.[0] + 16, pixel?.[1] + 16];
  const convert = getConvertByPixel(dom, pixel);
  convert.push(value);
  return convert;
}

export const getPixelByConvert = (dom, arry) => {
  return dom?.convertToPixel('geo', arry)
}

export const getConvertByPixel = (dom, arry) => {
  return dom?.convertFromPixel('geo', arry)
}

const getBarLine = (data,config) => {
  // 柱状体的主干
  // return {
  //   type: 'lines',
  //   effect: { show: false },
  //   label: { show: false },
  //   lineStyle: {
  //     width: 20,
  //     color: 'rgb(22,255,255, .6)',
  //     opacity: 1,
  //     curveness: 0
  //   },
  //   silent: true,
  //   ...config,
  //   data: lineData(data)
  // }
  return {
    type: 'custom',
    coordinateSystem: 'geo',
    renderItem: function (params, api) {
      const coord = api.coord(data[params.dataIndex].position);
      return {
        type: 'group',
        children: [
          {
            type: 'polygon',
            shape: {
              points: [
                [coord[0] - 10, coord[1]],
                [coord[0] - 10, coord[1] - 50],
                [coord[0] + 10, coord[1] - 50],
                [coord[0] + 10, coord[1]],
              ]
            },
            style: {
              fill: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#FFD338' // 0% 处的颜色
                }, {
                    offset: 1, color: 'rgba(243, 189, 51, 0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          {
            type: 'polygon',
            shape: {
              points: [
                [coord[0] + 10, coord[1]],
                [coord[0] + 20, coord[1] - 10],
                [coord[0] + 20, coord[1] - 60],
                [coord[0] + 10, coord[1] - 50],
              ]
            },
            style: {
              fill: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(255, 211, 56, 0.8)' // 0% 处的颜色
                }, {
                    offset: 1, color: 'rgba(243, 189, 51, 0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          {
            type: 'polygon',
            shape: {
              points: [
                [coord[0] - 10, coord[1] - 50],
                [coord[0] + 10, coord[1] - 50],
                [coord[0] + 20, coord[1] - 60],
                [coord[0], coord[1] - 60],
              ]
            },
            style: {
              fill: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#FFEB38' // 0% 处的颜色
                }, {
                    offset: 1, color: '#F7F3E3' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          {
            type: 'ring',
            scaleY: 0.6,
            originX: coord[0],
            originY: coord[1],
            shape: {
              cx: coord[0] + 5,
              cy: coord[1],
              r: 30,
              r0: 20,
            },
            style: {
              fill: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#FFEB38' // 0% 处的颜色
                }, {
                    offset: 1, color: '#F7F3E3' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }
        ]
      }
    },
    data: data
  }
}

const getBarTop = (data,config) => {
  // 柱状体的顶部
  return {
    type: 'scatter',
    coordinateSystem: 'geo',
    label: {
      show: true,
      formatter: function () {
        return `顶部label`
      },
      position: "top"
    },
    symbol: 'circle',
    symbolSize: [20, 10],
    itemStyle: {
      color: 'rgb(22,255,255, 1)',
      opacity: 1
    },
    silent: true,
    ...config,
    data: barTopData(data)
  }
}

const getBarBottom = (data,config) => {
  // 柱状体的底部
  return {
    type: 'scatter',
    coordinateSystem: 'geo',
    label: { show: false },
    symbol: 'circle',
    symbolSize: [20, 10],
    itemStyle: {
      // color: '#F7AF21',
      color: 'rgb(22,255,255, 1)',
      opacity: 1
    },
    silent: true,
    ...config,
    data: barBottomData(data)
  }
}

const getBarBottomRing = (data,config) => {
  // 底部外框
  return {
    type: 'scatter',
    coordinateSystem: 'geo',
    label: {
      show: false
    },
    symbol: 'circle',
    symbolSize: [40, 20],
    itemStyle: {
        color: {
        type: 'radial',
        x: 0.5,
        y: 0.5,
        r: 0.5,
        colorStops: [
            {
                offset: 0, color: 'rgb(22,255,255, 0)' // 0% 处的颜色
            }, 
            {
                offset: .75, color: 'rgb(22,255,255, 0)' // 100% 处的颜色
            },
            {
                offset: .751, color: 'rgb(22,255,255, 1)' // 100% 处的颜色
            },
            {
                offset: 1, color: 'rgb(22,255,255, 1)' // 100% 处的颜色
            }
        ],
        global: false // 缺省为 false
    },

      opacity: 1
    },
    silent: true,
    ...config,
    data: barBottomData(data)
  }
}

// 动态计算柱形图的高度（定一个max）
export const lineMaxHeight = (data) => {
  const maxValue = Math.max(...data.map(item => item.amount))
  return 0.5/maxValue
}

// 柱状体的主干
export const lineData = (data) => {
  return data.map((item) => {
    return {
      coords: [item.position, [item.position[0], item.position[1] + item.amount * lineMaxHeight(data)]]
    }
  })
}

// 柱状体的顶部
export const barTopData = (data) => {
  return data.map((item) => {
    return [item.position[0], item.position[1] + item.amount * lineMaxHeight(data)]
  })
}

// 柱状体的底部
export const barBottomData = (data) => {
  return data.map((item) => {
    return {
      name: item.name,
      value: item.position
    }
  })
}

export const getBarChartConfig = (option,data,config) => {
  const {
    barLine = {},
    barTop = {},
    barBottom = {},
    barBottomRing = {}
  } = config; 
  option.series.push(getBarLine(data,barLine));
  // option.series.push(getBarTop(data,barTop));
  // option.series.push(getBarBottom(data,barBottom));
  // option.series.push(getBarBottomRing(data,barBottomRing));
}

export const getLinesChartConfig = (option, data, config) => {
  option.series.push({
    type: 'lines',
    zlevel: 2,
    effect: {
      show: true,
      period: 4, //箭头指向速度，值越小速度越快
      trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
      symbol: 'arrow', //箭头图标
      symbolSize: 7, //图标大小
    },
    lineStyle: {
      color:'#1DE9B6',
      width: 1, //线条宽度
      opacity: 0.1, //尾迹线条透明度
      curveness: .3 //尾迹线条曲直度
    },
    ...config,
    data: [
      {coords: [[120.258889, 30.115833],[119.938333, 28.478333]],lineStyle:{color:'#4ab2e5'}},
      {coords: [[120.220000, 29.910833],[119.938333, 28.478333]],lineStyle:{color:'#4fb6d2'}}
    ]
  })
}

