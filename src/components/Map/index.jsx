import React, { useRef, useState } from 'react';
import { useMount, useUpdateEffect } from 'ahooks';
import { request } from 'umi';
import BASE_CONFIG from './assets/js/config';
import { SORT_ORDER_TYPE } from './assets/js/enum';
import { 
  isEmptyArray, 
  getVisualMapConfig, 
  getVisualMapColor, 
  getScatterConfig,
  getLabelConfig,
  isEmptyObject,
  getLabelValue,
  getPosition,
  getBaseMapSeries,
  getBarChartConfig,
  getLinesChartConfig
} from './assets/js/utils';
import styles from './index.less';


const echarts = require('echarts');
// const gl = require('echarts-gl')

// 浙江省 区县或区县拼接省级地图前往：http://thoughts.hyperchain.cn:8099/workspaces/5d4b89ddbe825b1e266e05b8/docs/637ed905be825b0001652b85

const MapBox = React.memo(({
  viewMode = 'plane',
  // 默认展示浙江省地图
  areaCode = 330000,
  areaName = '浙江省',
  countySplicing = false, // 浙江省地图 true: 区县拼接 false: 市拼接
  // 数据来源
  dataSource = [], // 基础地图渲染数据
  scatterSource, // 地图散点数据
  sortName = 'name',
  sortValue = 'value',
  scatterName = 'name',
  sortOrder = SORT_ORDER_TYPE.ASC.code, // 排序 默认升序
  // 开关
  showLabel = false, // 显示数值label
  drillDownMap = false, // 是否支持地图下钻
  texture = false, // 是否显示地图纹理
  textureImage = 'https://tmh-images.oss-cn-hangzhou.aliyuncs.com/defaultTexture.jpg', // 自定义纹理
  carouselTooltip = false, // 气泡窗轮播
  intervalTime = 3*1000, // 轮播定时时间
  // 区域展示自定义dom
  showCustomDom = false,
  renderCustomValue = () => {},
  // 插件
  barChart = false,
  barChartConfig,
  linesChart = false,
  linesChartConfig,
  // 映射处理
  mapVisual = null, // 区域映射
  scatterVisual = null, // 散点映射
  // 基本配置项
  chart = {},
  mapStyle = {},
  tooltip = {},
  // 通知父级组件区域编码
  setAreaCode = ()=> {}
}) => {

  const {
    
  } = chart;

  const {
    geo = {},
    map = {},
    areaNamePoint = {},
    scatter = {},
    visual = {},
    label = {}
  } = mapStyle;

  // tooltip配置项
  const {
    areaTooltip = {}, // 区域tooltip
    scatterTooltip = {} // 散点tooltip
  } = tooltip;

  const myChart = useRef(null);
  const chartRef = useRef();
  const timeRef = useRef();
  const currentIndexRef = useRef(-1);

  // 纹理图片
  const textureImg = new Image();

  // 注册地图名称（默认浙江省 330000）
  const [mapName, setMapName] = useState(330000);

  // 基础地图渲染数据
  const [mapData, setMapData] = useState({});

  // 图表渲染数据
  const [rawData, setRawData] = useState([]);

  // 地图下钻历史记录
  const [mapHistory, setMapHistory] = useState([]);

  // 设置option
  const getOption = () => {
    let mapOption = {};
    if (isEmptyArray(dataSource) || (dataSource || []).every((item) => JSON.stringify(item) === '{}')) {
      return mapOption;
    }
    mapOption = {
      visualMap: [],
      tooltip: {
        show: false,
        triggerOn: 'none', // 组件采用绑定事件控制tooltip，禁止默认的tooltip触发条件
      },
      geo: {
        show: true,
        id: 'gmap',
        map: mapName,
        ...BASE_CONFIG.geo,
        ...geo,
        itemStyle: {
          borderColor: BASE_CONFIG.defaultMapBorderColor,
          borderWidth: 1,
          areaColor: texture ? {
            image: textureImg,
            repeat: 'repeat',
          } : BASE_CONFIG.defaultMapAreaColor,
        },
      },
      series: [
        // 基础地图
        {
          name: '地区',
          type: 'map',
          map: mapName,
          ...BASE_CONFIG.geo,
          ...geo,
          itemStyle: {
            // 地图纹理样式
            areaColor: texture ? {
              image: textureImg,
              repeat: 'repeat',
            } : BASE_CONFIG.defaultMapAreaColor,
          },
          data: (mapData?.baseData || []).map((item) => {
            return {
              name: item.name,
              value: item.value,
              itemValue: item,
              label: { show: false },
              select: { disabled: true },
              emphasis: {
                disabled: true,
                label: { show: false },
              },
              ...map,
              itemStyle: {
                color: item?.visualMapColor?.emphasisColor || 'rgba(29, 98, 69, 0.56)',
                borderColor: BASE_CONFIG.defaultMapBorderColor,
                borderWidth: 1,
              },
            };
          }),
        },
        // 区域名称标点
        {
          name: '地区标点',
          type: 'scatter',
          coordinateSystem: 'geo',
          ...BASE_CONFIG.areaNameScatter,
          ...areaNamePoint,
          tooltip: {
            show: areaTooltip?.show || true,
            trigger: 'item',
            renderMode: 'html',
            // enterable: true,
            ...areaTooltip
          },
          data: (mapData?.areaNameScatter || []).map(item=>({
            ...item,
            name: item?.name,
            value: item?.position,
            itemValue: item,
          })),
        },
      ],
    };
    // 地图类型配置
    // if (viewMode === '3D') {
    //   mapOption.geo3D = {
    //     show: true,
    //     id: 'gmap',
    //     map: mapName,
    //     boxDepth: 90, //地图倾斜度
    //     shading: 'color',
    //     // colorMaterial: texture ? {
    //     //   detailTexture: textureImg
    //     // } : {},
    //     zlevel: -11
    //   }
    // }
    // 基础地图数据配置
    // mapOption.series.push(getBaseMapSeries({
    //   data: mapData?.baseData || [],
    //   viewMode,
    //   mapName,
    //   texture,
    //   textureImg,
    //   geo
    // }));
    // 判断基础地图区域映射
    if (mapVisual && mapVisual?.show) {
      // 配置映射
      mapOption.visualMap.push(getVisualMapConfig(mapData?.baseData,mapVisual,0,visual))
    }
    // 判断散点映射
    if (!isEmptyArray(mapData?.scatterData)) {
      if (scatterVisual && scatterVisual?.show) {
        // 配置映射
        mapOption.visualMap.push(getVisualMapConfig(mapData?.scatterData,scatterVisual,2,visual));
      }
      // 配置散点
      mapOption.series.push(getScatterConfig(mapData?.scatterData,scatter,scatterTooltip))
    }
    // 判断label配置
    if (showLabel) {
      mapOption.series.push(getLabelConfig(mapData?.labelData,label))
    }
    // 插件判断（柱状图，飞线图）
    if (barChart) {
      getBarChartConfig(mapOption,(mapData?.baseData || []),barChartConfig)
    }
    if (linesChart) {
      getLinesChartConfig(mapOption,(mapData?.baseData || []),linesChartConfig)
    }
    console.log(mapOption);
    return mapOption;
  };

  // 存储地图下钻历史记录
  const saveMapHistory = (code, name) => {
    const history = JSON.parse(JSON.stringify(mapHistory));
    if (isEmptyArray(history) || history?.[history.length - 1]?.code !== code) {
      history.push({
        areaCode: code,
        areaName: name
      });
    }
    setMapHistory(history);
  }

  // 获取对应区域json文件
  const getMapJson = async(name) => {
    // 读取本地json文件
    // let jsonData;
    // const url = `./assets/json/${name}.json`;
    // try {
    //   jsonData = await import(url);
    // } catch (error) {
    //   alert(`${name}.json文件不存在`);
    //   return {};
    // }
    // return jsonData?.default;

    // 读取外部json文件
    return new Promise((resolve) => {
      request(`https://tmh-images.oss-cn-hangzhou.aliyuncs.com/${name}.json`)
      .then(res=>{
        resolve(res);
      })
      .catch(()=>{
        console.log(`${name}地图文件不存在`);
        resolve({});
      })
    });
  }

  // 注册echarts区域地图
  const registerMap = async (code,name,type,callback) => {
    if (!code) {
      return;
    }
    let regName = code;
    if (Number(regName) === 330000) {
      regName = countySplicing ? '330000-county' : '330000'
    }
    
    if (!echarts.getMap(regName)) {
      const newMapJson = await getMapJson(regName);
      if (isEmptyObject(newMapJson)) {
        return;
      }
      echarts.registerMap(regName, newMapJson)
    }
    callback(regName,name,type);
  }

  // 初始化地图 geo配置项
  const updateMapGeo = code => {
    let option = {};
    if (viewMode === '3D') {
      // option = {
      //   geo3D: {
      //     show: true,
      //     id: 'gmap',
      //     map: mapName,
      //     boxDepth: 90, //地图倾斜度
      //     shading: 'color',
      //     colorMaterial: texture ? {
      //       detailTexture: textureImg
      //     } : {},
      //     zlevel: -11
      //   },
      // }
    }else{
      option = {
        geo: {
          show: true,
          id: 'gmap',
          map: code,
          ...BASE_CONFIG.geo,
          ...geo,
          itemStyle: {
            borderColor: BASE_CONFIG.defaultMapBorderColor,
            borderWidth: 1,
            areaColor: texture ? {
              image: textureImg,
              repeat: 'repeat',
            } : BASE_CONFIG.defaultMapAreaColor,
          },
        },
      }
    }
    myChart.current.setOption(option);
  }

  // 注册地图回调
  const registerMapCallback = (code, name, type) => {
    updateMapGeo(code);
    setMapName(code);
    setAreaCode(code);
    if (type === 'down') {
      saveMapHistory(code, name);
    }
  }

  // 点击事件 处理地图下钻
  const handleMapClick = (params) => {
    if (!drillDownMap) {
      return;
    }
    // 获取区域编码
    const code = params?.data?.itemValue?.adcode || params?.data?.adcode;
    // 获取区域名称
    const name = params?.data?.name;
    if (params?.componentSubType === "map") {
      registerMap(code, name, 'down', registerMapCallback)
    }else if(params?.componentSubType === "scatter" && params?.data?.adcode){
      registerMap(code, name, 'down', registerMapCallback)
    }
  };

  // 移出事件
  const handleMapMouseOut = () => {
    // 控制移出区域tooltip隐藏
    const chartDom = myChart?.current;
    chartDom.dispatchAction({
      type: 'hideTip',
      seriesIndex: 1, // 默认控制 区域名称标点 tooltip
      dataIndex: currentIndexRef.current,
    });
    
    // 轮播tooltip处理逻辑 清除定时器并重新开始定时器
    if (!carouselTooltip) {
      return;
    }
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
    timeRef.current = setInterval(() => handleSelectMap(), intervalTime);
  };

  // 鼠标移入事件
  const handleMapMouseOver = (params) => {
    // 控制移入区域tooltip显示
    const chartDom = myChart?.current;
    chartDom.dispatchAction({
      type: 'showTip',
      seriesIndex: 1,
      dataIndex: currentIndexRef.current,
      position: 'inside',
    });

    // 轮播tooltip处理逻辑 清除定时器
    if (!carouselTooltip) {
      return;
    }
    clearInterval(timeRef.current);
    currentIndexRef.current = params.dataIndex;
  };

  // 鼠标移动事件
  const handleMapMouseMove = (params) => {
    // 根据存储currentIndexRef与移动区域dataIndex判断是否相同，不同则隐藏上一个tooltip，显示当前tooltip
    if (params.dataIndex !== currentIndexRef.current) {
      const chartDom = myChart?.current;
      chartDom.dispatchAction({
        type: 'hideTip',
        seriesIndex: 1,
        dataIndex: currentIndexRef.current,
      });

      currentIndexRef.current = params.dataIndex;
      chartDom.dispatchAction({
        type: 'showTip',
        seriesIndex: 1,
        dataIndex: currentIndexRef.current,
        position: 'inside',
      });
    }
  }

  // 自动轮播控制显示tooltip
  const handleSelectMap = () => {
    const list = myChart?.current?.getOption()?.series?.[1]?.data;
    if (
      !myChart?.current || 
      myChart?.current < 0 || 
      isEmptyArray(list)
    ) {
      return;
    };
    const dataLen = list?.length;
    currentIndexRef.current = (currentIndexRef.current + 1) % (dataLen || 1);
    const chartDom = myChart?.current;
    chartDom.dispatchAction({
      type: 'showTip',
      seriesIndex: 1,
      dataIndex: currentIndexRef.current,
      position: 'inside',
    });
  };

  // 轮播tooltip处理逻辑
  const carouselFn = () => {
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
    if (carouselTooltip && intervalTime) {
      handleSelectMap();
      timeRef.current = setInterval(() => handleSelectMap(), intervalTime);
    }
    return () => {
      clearInterval(timeRef.current);
    };
  }

  const renderCustomDom = (arr) => {
    return arr.map((raw) => {
      return renderCustomValue(raw);
    });
  };

  // mapName/dataSource/scatterSource 三类数据更新后重组mapData数据
  useUpdateEffect(() => {
    (async () => {
      if (isEmptyArray(dataSource)) {
        return;
      }
      const arry = dataSource
        .filter((item) => Number(item.areaCode) !== 330000)
        .map((item) => ({
          ...item,
          name: item?.[sortName],
          amount: item?.[sortValue] || 0,
        }));
      // 获取对应区域json
      const MAP_JSON = await getMapJson(mapName);
      if (isEmptyObject(MAP_JSON)) {
        return;
      }
      // 补充地图相关属性
      const mapRawData = myChart.current ? MAP_JSON?.features?.map((v) => {
        const dom = myChart.current;
        const item = arry.find((l) => String(l.name) === String(v.properties.name));
        return {
          name: v.properties.name, // 区域名称
          adcode: v.properties.adcode, // 区域编码
          level: v.properties.level, // 区域级别
          position: v?.properties?.centroid || v?.properties?.center || getPosition(v?.properties?.name, dom),
          pixel: dom?.convertToPixel('geo', v?.properties?.name) || [],
          parentAdcode:  v.properties?.parent?.adcode, // 上一级区域编码
          parentAdName:  v.properties?.parent?.adName, // 上一级区域名
          ...item,
        };
      }) : arry;
      // 数据排序 默认升序
      const newList = mapRawData
        .sort((a, b) => {
          if (sortOrder === SORT_ORDER_TYPE.ASC.code) {
            return a?.[sortValue] - b?.[sortValue]; // 升序
          }
          return b?.[sortValue] - a?.[sortValue]; // 降序
        })
        .map((item,index)=>({
          ...item,
          value: mapVisual?.type === 'continuous' ? index + 1 : Number(item?.[sortValue]),
          visualMapColor: getVisualMapColor({
            val: mapVisual?.type === 'continuous' ? index + 1 : Number(item?.[sortValue]),
            visualMap: mapVisual,
            mapDataLength: mapRawData.length,
            countySplicing,
            areaName: item.name
          }),
        }))
      // 区县拼接省级地图，区域名称标点过滤
      const areaNameScatter = (countySplicing && mapName === '330000-county') ? newList.filter(item => item?.level === "city") : newList;
      const scatterList = scatterSource?.map((item,index) => ({
        name: item?.[scatterName],
        value: [item.x, item.y, scatterVisual?.type === 'continuous' ? index + 1 : Number(item?.[sortValue])],
        amount: item?.[sortValue]
      })) || [];
      const labelData = showLabel ? areaNameScatter.map(item=>({
        name: item?.name,
        value: getLabelValue(item?.position, item?.amount, myChart.current)
      })) : []
      setMapData({
        baseData: newList,
        areaNameScatter,
        scatterData: scatterList,
        labelData
      });
    })();
  }, [mapName, dataSource, scatterSource]);

  // mapData更新后加载纹理地图，加载完成设置地图option，绑定事件需在setOption后
  useUpdateEffect(() => {
    textureImg.src = textureImage;
    // textureImg.setAttribute('crossOrigin', 'Anonymous');
    textureImg.onload = () => {
      if (textureImg.complete) {
        const config = getOption();
        myChart.current.setOption(config);
        myChart.current.on('click', handleMapClick);
        myChart.current.on('mouseout', handleMapMouseOut);
        myChart.current.on('mouseOver', handleMapMouseOver);
        myChart.current.on('mousemove', handleMapMouseMove);
        carouselFn();
      }
    };
    
  }, [mapData]);

  useMount(()=>{
    if (chartRef.current) {
      // 初始化地图
      myChart.current = echarts.init(chartRef.current, null, {width: 'auto',height: 'auto'});
      // 注册地图
      registerMap(areaCode, areaName, 'down', registerMapCallback);
    }
  })

  return (
    <div className={styles.mapWrap}>
      <div className={styles.mapContent} ref={chartRef}></div>
      { showCustomDom && renderCustomDom((mapData?.baseData || []))}
    </div>
  );
});
export default MapBox;
