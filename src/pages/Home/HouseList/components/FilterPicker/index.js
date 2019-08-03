import React, { Component } from "react";

import { PickerView } from "antd-mobile";

import FilterFooter from "../../../../../components/FilterFooter";

export default class FilterPicker extends Component {
    state = {
        value: this.props.defaultValue
    };

    onChange = val => {
        this.setState({
            value: val
        });
    };

    render() {
        const { onCancle, onSave, data, cols, type } = this.props;
        return (
            <>
                {/* 选择器组件： */}
                <PickerView
                    data={data}
                    value={this.state.value}
                    onChange={this.onChange}
                    cols={cols}
                />

                {/* 底部按钮 */}
                <FilterFooter
                    onCancle={() => onCancle(type)}
                    onSave={() => onSave(type, this.state.value)}
                />
            </>
        );
    }
}
