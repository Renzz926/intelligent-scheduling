import React, { useState, useEffect } from 'react';
import styles from './index.less';

export default function ProgressBar({
  data = [{value: 30},{value: 30},{value: 40}],
  color = ['#2278FA','#30A8F2','#23E1ED'],
  sortName = 'value',
  min = 5
}) {

  const [total, setTotal] = useState(0);

  const getProgressValue = (num) => {
    let value = Number(num/total*100).toFixed(2);
    if (value < min) {
      value = min
    }
    return value
  }

  useEffect(()=>{
    let num = 0;
    data.map(item=>{
      num += item?.[sortName] || 0
    })
    setTotal(num);
  },[data])
  
  return (
    <div className={styles.progressBarWrap}>
      {
        Array.isArray(data) && total && data.map((item, index) =>(
          <div className={styles.barBox} style={{background: color[index], width: `${getProgressValue(item?.[sortName])}%`}}/>
        ))
      }
    </div>
  );
}
