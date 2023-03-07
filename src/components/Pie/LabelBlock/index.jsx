import React from 'react';
import { getParams } from '@/utils/formatPie.js';
import styles from './index.less';

const LabelBlock = (props) => {
  const { data, labelPos, option, hightlightIndex } = props;
  return (
    <>
      {data.map((item, index) => {
        if (!item.show) return <></>;
        const params = getParams({ data, index });
        const startPos = labelPos[params.dataIndex]?.[0] || [];
        const endPos = labelPos[params.dataIndex]?.[labelPos.length - 1 || 0] || [];
        const isLeft = startPos[0] - endPos[0] > 0;

        const isActive = hightlightIndex === params.dataIndex;

        const activeLabel = {
          ...option?.emphasis?.label,
          ...item.emphasis?.label,
        };
        const normalLabel = {
          ...option?.label,
          ...item.label,
        };
        return (
          <div
            style={{
              left: endPos?.[0],
              top: endPos?.[1],
              transform: `translate(${isLeft ? '-100%' : 0}, -50%)`,
              maxWidth: endPos?.[0],
            }}
            key={`label_${item.name}`}
            className={styles["label-item"]}
          >
            {activeLabel?.content
              ? isActive
                ? activeLabel.content(params)
                : normalLabel.content && normalLabel.content(params)
              : normalLabel.content && normalLabel.content(params)}
          </div>
        );
      })}
    </>
  );
};
export default LabelBlock;
