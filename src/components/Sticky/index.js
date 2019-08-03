import React, { Component, createRef } from "react";
import styles from "./index.module.scss";
import PropTypes from "prop-types";

class Sticky extends Component {
    placeholderRef = createRef();
    contentRef = createRef();

    handleScroll = () => {
        const height = this.props.height;
        // console.log(this.contentRef.current.getBoundingClientRect().height);
        const placeholder = this.placeholderRef.current;
        const content = this.contentRef.current;

        const { top } = placeholder.getBoundingClientRect();

        if (top <= 0) {
            // 需要让筛选框吸顶，并且让占位内容有高度（高度为筛选框的高度）
            placeholder.style.height = height;
            content.classList.add(styles.fixed);
        } else {
            // 占位内容高度为0，筛选框取消吸顶
            placeholder.style.height = 0;
            content.classList.remove(styles.fixed);
        }
    };

    // 添加窗口滚动事件
    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    // 组件销毁的时候注销事件
    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    render() {
        const { children } = this.props;
        return (
            <div>
                {/* 占位符，用于当筛选框吸顶脱标后撑高度 */}
                <div ref={this.placeholderRef} />
                {/* 筛选框的内容 */}
                <div ref={this.contentRef}>{children}</div>
            </div>
        );
    }
}

Sticky.propTypes = {
    height: PropTypes.number.isRequired
};

export default Sticky;
