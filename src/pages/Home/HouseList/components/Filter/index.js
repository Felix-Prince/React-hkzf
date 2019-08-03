import React, { Component } from "react";

import { API, getCurrentCity } from "../../../../../utils";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import { Spring } from "react-spring/renderprops";

import styles from "./index.module.css";

const titleSelectedStatus = {
    area: false,
    mode: false,
    price: false,
    more: false
};

// 选中的筛选条件数据
const selectedValues = {
    area: ["area", "null"],
    mode: ["null"],
    price: ["null"],
    more: []
};

export default class Filter extends Component {
    state = {
        titleSelectedStatus,
        openType: "",
        filtersData: {},
        selectedValues
    };

    componentDidMount() {
        // 获取筛选条件数据
        this.getFilterData();

        // 在组件渲染完成时，获取到 body 对象
        this.htmlBody = document.body;
    }

    async getFilterData() {
        const { value } = await getCurrentCity();

        let res = await API.get("/houses/condition", {
            params: {
                id: value
            }
        });
        this.setState({
            filtersData: res.data.body
        });
    }

    /**
     * 1. 如果type=area ,那么默认值不能是 ['area','null'],即长度不能为2,且第一个值不能是'area'
     * 2. 如果type=mode ,那么默认值不能是['null']
     * 3. 如果type=price ,那么默认值不能是['null']
     * @param {string} type 筛选类型
     * @param {Array} selectedVal 默认值
     */
    judgeHighLight(type, selectedVal) {
        let isHighLight = false;
        if (
            type === "area" &&
            (selectedVal.length === 3 || selectedVal[0] === "subway")
        ) {
            isHighLight = true;
        } else if (type === "mode" && selectedVal[0] !== "null") {
            isHighLight = true;
        } else if (type === "price" && selectedVal[0] !== "null") {
            isHighLight = true;
        } else if (type === "more" && selectedVal.length > 0) {
            isHighLight = true;
        } else {
            isHighLight = false;
        }

        return isHighLight;
    }

    // 点击四个选项切换筛选条件
    toggleTitleSelect = type => {
        // 给 body 添加一个类名，让其超过部分隐藏,用于解决筛选框展开后还能滚动的问题
        this.htmlBody.className = "hidden";
        const { titleSelectedStatus, selectedValues } = this.state;
        // 不要直接修改state中的数据，因此这里把数据拷贝一份
        const newTitleSelected = { ...titleSelectedStatus };

        Object.keys(titleSelectedStatus).forEach(key => {
            const selectedVal = selectedValues[key];
            if (key === type) {
                // 表示当前遍历的和点击的是同一个，则高亮
                newTitleSelected[key] = true;
            } else {
                newTitleSelected[key] = this.judgeHighLight(key, selectedVal);
            }
        });
        this.setState({
            titleSelectedStatus: newTitleSelected,
            openType: type
        });
    };

    // 点击取消按钮及遮罩时隐藏筛选界面
    onCancle = type => {
        // 取消body的类名
        this.htmlBody.className = "";

        const newTitleSelected = { ...this.state.titleSelectedStatus };
        const selectedVal = this.state.selectedValues[type];
        // console.log(selectedValues[type]);

        newTitleSelected[type] = this.judgeHighLight(type, selectedVal);
        this.setState({
            titleSelectedStatus: newTitleSelected,
            openType: ""
        });
    };

    // 点击确定按钮
    onSave = (type, value) => {
        // 因为pickView在点击确定后会销毁，因此不能用于存储选择后的筛选条件信息
        const { titleSelectedStatus, selectedValues } = this.state;

        const newTitleSelected = { ...titleSelectedStatus };

        newTitleSelected[type] = this.judgeHighLight(type, value);

        // 筛选条件，处理后的
        const filters = {};

        // 全部的筛选条件，未经处理的
        const newSelectedValues = { ...selectedValues, [type]: value };

        const area = newSelectedValues.area;
        const areaKey = area[0]; // 是area 还是 subway
        let areaValue;
        if (area.length === 2) {
            areaValue = "null";
        } else {
            areaValue = area[2] === "null" ? area[1] : area[2];
        }
        filters[areaKey] = areaValue;

        filters.rentType = newSelectedValues.mode[0];
        filters.price = newSelectedValues.price[0];
        filters.more = newSelectedValues.more.join(",");

        // console.log(selectedValues, filters);

        this.props.onFilter(filters);

        this.setState({
            openType: "",
            titleSelectedStatus: newTitleSelected,
            selectedValues: newSelectedValues
        });
    };

    renderFilterPicker() {
        const {
            openType,
            filtersData: { area, subway, rentType, price },
            selectedValues
        } = this.state;
        if (openType === "more" || openType === "") return null;

        // 根据不同筛选条件传递不同的数据源
        let data;
        // 设置pickView的列数
        let cols = 1;
        // 用于 PickView 第二次选择时有默认数据
        let defaultValue = selectedValues[openType];
        switch (openType) {
            case "area":
                data = [area, subway];
                cols = 3;
                break;
            case "mode":
                data = rentType;
                break;
            case "price":
                data = price;
                break;
            default:
                break;
        }

        return (
            <FilterPicker
                key={openType}
                defaultValue={defaultValue}
                type={openType}
                cols={cols}
                data={data}
                onCancle={this.onCancle}
                onSave={this.onSave}
            />
        );
    }

    renderFilterMore() {
        const {
            openType,
            filtersData: { roomType, oriented, floor, characteristic },
            selectedValues
        } = this.state;
        if (openType !== "more") return null;

        const data = { roomType, oriented, floor, characteristic };

        const defaultValue = selectedValues[openType];

        return (
            <FilterMore
                data={data}
                onSave={this.onSave}
                onCancle={this.onCancle}
                type={openType}
                defaultValue={defaultValue}
            />
        );
    }

    renderMask() {
        const { openType } = this.state;

        const isHide = openType === "more" || openType === "";

        // if (openType === "more" || openType === "") return null;

        return (
            <Spring to={{ opacity: isHide ? 0 : 1 }}>
                {props => {
                    // 使得遮罩层不会阻挡我们的操作
                    if (props.opacity === 0) return null;
                    return (
                        <div
                            style={props}
                            className={styles.mask}
                            onClick={() => this.onCancle(openType)}
                        />
                    );
                }}
            </Spring>
        );
    }

    render() {
        return (
            <div className={styles.root}>
                {/* 前三个菜单的遮罩层 */}
                {this.renderMask()}

                {/* {openType === "area" ||
                openType === "mode" ||
                openType === "price" ? (
                    <div
                        className={styles.mask}
                        onClick={() => this.onCancle(openType)}
                    />
                ) : null} */}

                <div className={styles.content}>
                    {/* 标题栏 */}
                    <FilterTitle
                        titleSelectedStatus={this.state.titleSelectedStatus}
                        onClick={this.toggleTitleSelect}
                    />

                    {/* 前三个菜单对应的内容： */}
                    {this.renderFilterPicker()}

                    {/* 最后一个菜单对应的内容： */}
                    {this.renderFilterMore()}
                </div>
            </div>
        );
    }
}
