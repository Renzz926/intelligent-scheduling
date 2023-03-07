# 折线图 柱状图 1.0.0

## 技术栈

- react 17
- [umi4](https://umijs.org/docs/tutorials/getting-started)
- echarts 5.4.0

## 功能支持
1. 封装（多柱，折柱混合）柱状图
2. 重合柱状图
3. 堆叠柱状图
4. 平均值标注
5. 区域缩放
6. 指定范围映射
7. 自定义dom Tooltip支持
8. 控制显示最大值label
9. 图表label轮播
10. x轴数据轮播

## 组件入参
```javascript
{
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
  style
}
```

入参格式说明：
1. data 图表数据传入
```javascript
  [
    { name: '1月', value: 100 },
    { name: '2月', value: 200 },
    { name: '3月', value: 300 },
    { name: '4月', value: 400 },
    { name: '5月', value: 500 },
    { name: '6月', value: 600 },
    { name: '7月', value: 700 },
    { name: '8月', value: 800 },
    { name: '9月', value: 900 },
    { name: '10月', value: 1000 },
    { name: '11月', value: 1100 },
    { name: '12月', value: 1200 }
  ]
```
若数据格式如下，需要额外传入xField="time"
```javascript
  [
    { time: '1月', value: 100 },
    { time: '2月', value: 200 },
    { time: '3月', value: 300 },
    { time: '4月', value: 400 },
    { time: '5月', value: 500 },
    { time: '6月', value: 600 },
    { time: '7月', value: 700 },
    { time: '8月', value: 800 },
    { time: '9月', value: 900 },
    { time: '10月', value: 1000 },
    { time: '11月', value: 1100 },
    { time: '12月', value: 1200 }
  ]
```

2. seriesMap 图表配置
```javascript
  seriesMap={[
    {
      type: 'bar', // 图表配型（支持传入：line / bar）
      code: 'value', // 控制图表Y轴数据字段
      desc: '排放量', // 数据描述（用于图例，tooltip等展示）
      color: '#30A8F2', // 颜色（用于柱状图柱体颜色，折线颜色，支持渐变色）
      stack: 'group1', // 堆叠柱状图标识字段，stack值相同为同一组堆叠
      barGap: '-100%', // 该设置可使双柱重合 实现实际/预估的进度条效果
    }
  ]}
```

3. diffColorConfig 柱状图数据映射
```javascript
  diffColorConfig={{
    show: true, // 控制是否生效
    pieces: [ // 自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式 同https://echarts.apache.org/zh/option.html#visualMap-piecewise.pieces
      {gt: 1000, color: '#30A8F2'},
      {gt: 500, lte: 1000, color: '#000'},
      {gt: 200, lte: 500, color: '#30A8F2'},
      {lt: 200, color: '#000'},
    ]
  }}
```

4. 基础图表自定义配置参数
```javascript
  xAxisProps, // x轴样式自定义配置
  yAxisProps, // y轴样式自定义配置
  gridProps, // 直角坐标系内绘图网格自定义配置
  dataZoomProps, // 区域缩放自定义配置
  tooltipProps, // tooltip自定义配置
  seriesProps, // series自定义配置
```

5. tooltip 自定义tooltip控制
```javascript
  import { createRoot } from 'react-dom/client';
  const EChartToolTips = ({data}) => {
    return <div>自定义tooltip / {data?.name} : {data?.value}</div>
  }

  {
    formatter: params => {
      setTimeout(()=>{
        const container = document.getElementById('tool-tip');
        const root = createRoot(container);
        root.render(<EChartToolTips data={params} />); 
      },0)
      return `<div id="tool-tip"></div>`;
    }
  }
```
