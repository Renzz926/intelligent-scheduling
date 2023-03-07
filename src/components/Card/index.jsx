import cn from "classnames";
import React, { useState } from "react";
import { Tab } from "../Tab/Tab";
import MySelect from "@/components/MySelect/index";
import { isEmptyArray } from "@/utils/utils";
import styles from "./index.less";
import { history } from "umi";

const Card = React.memo(
  ({
    title = "-",
    onTitleClick,
    redirectUrl,
    children,
    tabProps = { tabOptions: [], onTabChange: () => {} },
    selectProps = {
      selectOptions: [],
      onSelectChange: () => {},
    },
    buttonProps = { text: "", onClick: () => {} },
    operatorPosition = "inside",
    tagStatus,
    selectStyle = {},
    bodyStyle = {},
    cardStyle = {},
    icon = "",
    iconPosition = "right",
  }) => {
    const { tabOptions, onTabChange } = tabProps;
    const { selectOptions, onSelectChange, ...selectPropsOthers } = selectProps;
    const { text: buttonText, onClick } = buttonProps;
    const [activeTab, setActiveTab] = useState(tabOptions[0]?.value);
    const handleTabChange = (v) => {
      setActiveTab(v);
      onTabChange && onTabChange(v);
    };

    const [selected, setSelected] = useState(selectOptions[0]?.value);
    const handleSelectChange = (v) => {
      setSelected(v);
      onSelectChange && onSelectChange(v);
    };

    const handleTitleClick = () => {
      if (redirectUrl) {
        history.push(redirectUrl);
      } else {
        onTitleClick && onTitleClick();
      }
    };

    return (
      <div className={styles.cardContainer} style={cardStyle}>
        <div className={styles.cardHeader}>
          <span
            onClick={handleTitleClick}
            className={cn(styles.noneSelect, {
              [styles.title]: redirectUrl || onTitleClick,
            })}
          >
            {title}
          </span>
          {tagStatus && (
            <div className={styles.tag}>
              {tagStatus === "leisure" ? (
                <div className={styles.tag1}>空闲中</div>
              ) : (
                <div className={styles.tag2}>占用中</div>
              )}
            </div>
          )}
        </div>

        <div className={styles.cardContent} style={bodyStyle}>
          {children}
        </div>
      </div>
    );
  }
);

export default Card;
