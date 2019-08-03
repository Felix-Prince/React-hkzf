import React from "react";

import { Flex } from "antd-mobile";

import styles from "./index.module.css";

function FilterFooter({ style, className, onCancle, onSave, cancelText }) {
    return (
        <Flex
            style={style}
            className={[styles.root, className || ""].join(" ")}
        >
            {/* 取消按钮 */}
            <span
                className={[styles.btn, styles.cancel].join(" ")}
                onClick={onCancle}
            >
                {cancelText}
            </span>

            {/* 确定按钮 */}
            <span
                className={[styles.btn, styles.ok].join(" ")}
                onClick={onSave}
            >
                确定
            </span>
        </Flex>
    );
}

FilterFooter.defaultProps = {
    cancelText: "取消"
};

export default FilterFooter;
