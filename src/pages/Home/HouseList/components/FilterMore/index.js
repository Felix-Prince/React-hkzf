import React, { Component } from "react";

import FilterFooter from "../../../../../components/FilterFooter";

import styles from "./index.module.css";

export default class FilterMore extends Component {
    state = {
        // 选择的值
        selectedValues: this.props.defaultValue
    };

    // 选择标签
    toggleTags = value => {
        console.log(value);
        const { selectedValues } = this.state;

        let selectedVal = [...selectedValues];

        if (selectedVal.indexOf(value) !== -1) {
            // 已经选中的再次点击表示取消选中
            selectedVal = selectedVal.filter(item => item !== value);
        } else {
            // 选中当前项
            selectedVal.push(value);
        }

        this.setState({
            selectedValues: selectedVal
        });
    };

    // 渲染标签
    renderFilters(data) {
        // 高亮类名： styles.tagActive
        return data.map(item => {
            const isHighLight =
                this.state.selectedValues.indexOf(item.value) > -1;
            return (
                <span
                    key={item.value}
                    className={[
                        styles.tag,
                        isHighLight ? styles.tagActive : ""
                    ].join(" ")}
                    onClick={() => this.toggleTags(item.value)}
                >
                    {item.label}
                </span>
            );
        });
    }

    render() {
        const {
            data: { roomType, oriented, floor, characteristic },
            onSave,
            type,
            onCancle
        } = this.props;
        return (
            <div className={styles.root}>
                {/* 遮罩层 */}
                <div className={styles.mask} onClick={() => onCancle(type)} />

                {/* 条件内容 */}
                <div className={styles.tags}>
                    <dl className={styles.dl}>
                        <dt className={styles.dt}>户型</dt>
                        <dd className={styles.dd}>
                            {this.renderFilters(roomType)}
                        </dd>

                        <dt className={styles.dt}>朝向</dt>
                        <dd className={styles.dd}>
                            {this.renderFilters(oriented)}
                        </dd>

                        <dt className={styles.dt}>楼层</dt>
                        <dd className={styles.dd}>
                            {this.renderFilters(floor)}
                        </dd>

                        <dt className={styles.dt}>房屋亮点</dt>
                        <dd className={styles.dd}>
                            {this.renderFilters(characteristic)}
                        </dd>
                    </dl>
                </div>

                {/* 底部按钮 */}
                <FilterFooter
                    className={styles.footer}
                    cancelText="清除"
                    onCancle={() => this.setState({ selectedValues: [] })}
                    onSave={() => onSave(type, this.state.selectedValues)}
                />
            </div>
        );
    }
}
