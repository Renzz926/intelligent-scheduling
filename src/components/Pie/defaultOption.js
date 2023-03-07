const defaultColor = [
    '#77E4E4',
    '#E47676',
    '#E88E23',
    '#FAE55F',
    '#EAFF8F',
    '#68C57C',
    '#7CB305',
    '#BAE7FF',
    '#99BEFF',
    '#30A8F2',
    '#11BEEA',
  ];
  
const defaultOption = {
  tooltip: {
    trigger: 'item',
  },
  legend: {},
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
  color: defaultColor,
};

const defaultAutoOption = {
  time: 3000,
};
  export { defaultColor, defaultAutoOption };
  export default defaultOption;
  