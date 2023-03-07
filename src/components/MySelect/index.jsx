import React from "react";
import styles from "./index.less";
import { Select } from "antd";

const MySelect = React.memo(
  ({
    value = "",
    handleChange = () => {},
    option = [],
    bordered = true, //是否有边框
    suffixIcon, //自定义的选择框后缀图标
    style = {}, //选择框的样式
    className, //选择框的class，通过该class可以自定义某一个select的选择框样式
    popupClassName, //下拉菜单的class，通过该class可以自定义某一个select的下拉菜单样式
    dropdownStyle, //下拉菜单的style
    ...others //其他属性可查看ant design文档：https://4x.ant.design/components/select-cn/#API
  }) => {
    return (
      <div className={styles.selectContainer}>
        <Select
          defaultValue={value}
          style={style}
          dropdownStyle={dropdownStyle}
          bordered={bordered}
          suffixIcon={suffixIcon}
          onChange={handleChange}
          className={className}
          popupClassName={popupClassName}
          options={option}
          {...others}
        />
      </div>
    );
  }
);
export default MySelect;
