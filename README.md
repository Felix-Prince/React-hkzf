# 项目说明

## 文件结构说明

```
|-- src
|   |-- assets      静态资源，比如：图片、字体等
|   |-- components  公共组件，多个页面中都需要用到的组件
|   |-- pages       页面组件
|   |-- utils       工具类
|   |-- App.js      根组件（用来配置路由等）
|   |-- index.js    项目的入口文件

```

## 技术栈

react + react-route-dom + antd-mobile

## 技术依赖

使用到的相关组件库

1. `react-router-dom` 用于实现路由的
    - 用到的组件：`BrowserRouter` `Link` `Route` `Redirect`
2. `react-virtualized` 用于实现列表滚动，原理：只加载可视区域内的内容，避免了性能的消耗
    - 用到的组件：`List`(列表形式) `AutoSizer`(自动适应屏幕大小) `WindowScroller`(跟随窗口滚动) `InfiniteLoader`(无限滚动)
3. `react-spring` 这是一个动画库，可以实现组件的动画效果
4. `classnames` 在 `react` 中处理样式的类名相对来说没有 Vue 中那么方便，使用了这个库以后据可以方便的处理类名
    - 比如：<div className={classNames({class1,{class2:true}})}>
5. `formik` 和 `yup` 这两是用于处理表单以及表单校验的
