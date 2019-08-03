import React from "react";

import { NavBar } from "antd-mobile";
// 导入路由的 withRouter 高阶组件
import { withRouter } from "react-router-dom";
// 导入组件样式
import styles from "./index.module.scss";
// 导入参数校验
import PropTypes from "prop-types";

function NavHeader({ history, children, rightContent, className }) {
    return (
        <NavBar
            className={[styles.navBar, className].join(" ")}
            mode="light"
            icon={<i className="iconfont icon-back" />}
            onLeftClick={() => history.go(-1)}
            rightContent={rightContent}
        >
            {children}
        </NavBar>
    );
}

NavHeader.propTypes = {
    children: PropTypes.string.isRequired
};

// 通过高阶组件，让我们的 NavHeader 组件有了相应的路由信息
export default withRouter(NavHeader);
