import React, { useState, useRef } from 'react';
import { useUnmount, useUpdateEffect } from 'ahooks';
import ReactEcharts from 'echarts-for-react';
import Empty from '../../Empty';
import BASE_CONFIG from '../assets/js/barsConfig';
import { isEmptyArray } from '@/utils/utils';

function diffFunction(value, config, defaultColor) {
  let color = defaultColor;
  const arr = config?.pieces || [];
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].gt && !arr[i].lte && value > arr[i].gt) {
      color = arr[i]?.color || defaultColor;
      break;
    }

    if (arr[i].gt && arr[i].lte && value > arr[i].gt && value <= arr[i].lte) {
      color = arr[i]?.color || defaultColor;
      break;
    }

    if (!arr[i].gt && arr[i].lte && value <= arr[i].lte) {
      color = arr[i]?.color || defaultColor;
      break;
    }
  }
  return color;
}

function controlLabel(value, data, key, config, showLabel, showMaxLabel) {
  if (showLabel) {
    return config || {
      show: true
    }
  }
  const arr = [...data];
  arr.sort((a, b) => {
    if (a && typeof a === 'object') {
      return Number(b[key]) - Number(a[key]);
    }
    return b - a;
  });
  if (showMaxLabel && value === arr[0][key]) {
    return config || {
      show: true
    }
  }
  return {
    show: false
  }
}

export default function BarsChart({
  data = [], // 图表数据
  xField = 'name', // x轴字段
  seriesMap = [], // 图表配置
  xAxisProps, // x轴样式自定义配置
  yAxisProps, // y轴样式自定义配置
  gridProps, // 直角坐标系内绘图网格自定义配置
  dataZoomProps, // 区域缩放自定义配置
  tooltipProps, // tooltip自定义配置
  seriesProps, // series自定义配置
  diffColorConfig, // 范围映射自定义配置
  showLabel = false, // 是否显示label
  showMaxLabel = false, // 显示最大值label
  carouselLabel = false, // label轮播
  intervalTime = 3*1000, // 轮播定时时间
  carouselXAxis = false, // x轴轮播
  carouselXAxisConfig = {
    limit: 6, // 初始展示个数
    intervalTime: 3*1000, // 轮播定时时间
  }, // x轴轮播配置项
  style
}) {

  const [chartData, setChartData] = useState([]);

  const chartRef = useRef();
  const timeRef = useRef();
  const xAxisTimeRef = useRef();
  const currentIndexRef = useRef(-1);
  const currentXAxisIndexRef = useRef(-1);

  // 设置option
  const getOption = () => {
    let chartOption = {};
    if (isEmptyArray(chartData) ||isEmptyArray(seriesMap) || (chartData || []).every((item) => JSON.stringify(item) === '{}')){
      return chartOption;
    } 

    chartOption = {
      legend: seriesMap.length !== 1 ? {
        data: seriesMap.map((item) => item.desc),
        ...BASE_CONFIG.legend
      } : null,
      tooltip: {
        show: tooltipProps?.show || false,
        trigger: 'item',
        renderMode: 'html',
        // enterable: true,
        ...tooltipProps
      },
      xAxis: [
        {
          type: 'category',
          data: chartData.map((item) => item[xField]),
          ...BASE_CONFIG.xAxis,
          ...xAxisProps
        },
      ],
      yAxis: [
        {
          name: '',
          type: 'value',
          nameLocation: 'end',
          ...BASE_CONFIG.yAxis,
          ...yAxisProps
        }
      ],
      grid: {
        ...BASE_CONFIG.grid,
        ...gridProps
      },
      ...dataZoomProps,
      series: seriesMap.map((item) => {
        return {
          name: item.desc,
          type: item?.type || 'bar',
          yAxisIndex: item?.yAxisIndex ? item?.yAxisIndex : 0,
          data: chartData.map((i) => {
            const dealData = {
              name: item.desc,
              value: Number(i[item.code]),
              color: item?.color
            };
            return {
              name: dealData.name,
              value: dealData.value,
              itemStyle: {
                color: i.color,
              },
              label: controlLabel(i[item.code],chartData,item.code, seriesProps?.label, showLabel, showMaxLabel),
              ...seriesProps,
            };
          }),
          ...BASE_CONFIG.barsSeries,
          ...seriesProps,
          lineStyle: {
            color: item?.color,
          },
          stack: item?.stack,
          barGap: item?.barGap || BASE_CONFIG.barsSeries.barGap,
          markLine: seriesProps?.markLine,
        };
      }),
    };
    
    return chartOption;
  };

  const [option, setOption] = useState(getOption(chartData));

  // 自动轮播控制显示label
  const handleEmphasisLabel = () => {
    if (
      !chartRef?.current || 
      chartRef?.current < 0 || 
      isEmptyArray(chartData)
    ) {
      return;
    };
    const dataLen = chartData?.length;
    const oldCurrent = currentIndexRef.current;
    currentIndexRef.current = (currentIndexRef.current + 1) % (dataLen || 1);
    const chartDom = chartRef?.current?.getEchartsInstance();
    chartDom.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: oldCurrent,
    });
    chartDom.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: currentIndexRef.current,
    });
  };

  const handleCarouselXAxis = () => {
    let newArry = [...chartData];
    let nowIndex = currentXAxisIndexRef.current;
    const newNum = nowIndex + 1 >= data.length ? carouselXAxisConfig?.limit : nowIndex + 1;
    if (newNum === data.length) {
      newNum = 0;
    }
    newArry.shift();
    newArry.push(data[newNum]);
    currentXAxisIndexRef.current = newNum;
    setChartData(newArry);
  }

  // 轮播label处理逻辑
  const carouselLabelFn = () => {
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
    if (carouselLabel && intervalTime) {
      handleEmphasisLabel();
      timeRef.current = setInterval(() => handleEmphasisLabel(), intervalTime);
    }
    return () => {
      clearInterval(timeRef.current);
    };
  }

  // 轮播x轴处理逻辑
  const carouselXAxisFn = () => {
    if (xAxisTimeRef.current) {
      clearInterval(xAxisTimeRef.current);
    }
    if (carouselXAxis && carouselXAxisConfig?.intervalTime) {
      timeRef.current = setInterval(() => handleCarouselXAxis(), carouselXAxisConfig?.intervalTime);
    }
    return () => {
      clearInterval(xAxisTimeRef.current);
    };
  }

  useUpdateEffect(()=>{
    if (carouselXAxis && carouselXAxisConfig?.limit) {
      const sliceData = data.slice(0,carouselXAxisConfig?.limit);
      currentXAxisIndexRef.current = carouselXAxisConfig?.limit - 1;
      setChartData(sliceData);
    }else{
      setChartData(data);
    }
  },[data])

  useUpdateEffect(()=>{
    if (chartRef.current) {
      chartRef.current.getEchartsInstance().resize();
    }
    setOption(getOption(chartData));
  },[chartData,data]);

  useUpdateEffect(()=>{
    carouselLabelFn();
    carouselXAxisFn();
  },[option])

  useUnmount(()=>{
    chartRef.current?.getEchartsInstance()?.dispose();
  })

  if (isEmptyArray(data)) {
    return <Empty />;
  }
  return (
    <ReactEcharts 
      ref={chartRef} 
      option={option} 
      style={{ width: '100%', height: '100%', ...style }} 
    />
  );
}
