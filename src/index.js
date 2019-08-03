import React from "react";
import ReactDOM from "react-dom";

// 引入根组件
import App from "./App";

// 导入 react-virtualized 组件库样式
import "react-virtualized/styles.css";

// 全局的样式
import "antd-mobile/dist/antd-mobile.css";

// 导入字体图标库
import "./assets/fonts/iconfont.css";

// 导入全局样式
import "./index.css";

ReactDOM.render(<App />, document.getElementById("root"));
