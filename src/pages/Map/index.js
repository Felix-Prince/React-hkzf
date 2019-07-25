import React, { Component } from 'react';

// 导入样式
import "./index.scss"

// 注意：如果要在脚手架代码中访问全局对象，应该 通过 window 来访问
// https://facebook.github.io/create-react-app/docs/using-global-variables
const BMap = window.BMap

// navigator.geolocation.getCurrentPosition(position => {
//     console.log(position)
// })

class Map extends Component {
    componentDidMount() {

        // navigator.geolocation.getCurrentPosition(position => {
        //     // postion 对象中，常用属性的文档：
        //     // https://developer.mozilla.org/zh-CN/docs/Web/API/Coordinates
        //     console.log('当前位置信息：', position)
        // })
        // 创建百度地图对象
        // 参数：表示地图容器的id值
        const map = new BMap.Map('container')
        // 设置地图中心点坐标
        // const point = new BMap.Point(116.404, 39.915)
        const point = new BMap.Point(121.61833152747242, 31.040108832402957)
        // 使用中心点坐标初始化地图
        map.centerAndZoom(point, 18)
    }

    render() {
        return (
            <div className='map'>
                <div id="container"></div>
            </div>
        );
    }
}

export default Map;