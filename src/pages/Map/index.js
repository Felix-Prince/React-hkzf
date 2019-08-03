import React, { Component } from "react";

// 导入 头部导航组件
import NavHeader from "../../components/NavHeader";
// 导入Toast组件
import { Toast } from "antd-mobile";

import HouseItem from "../../components/HouseItem";

// 导入样式
// import "./index.scss";
import styles from "./index.module.scss";

import { getCurrentCity, BASE_URL } from "../../utils";

import axios from "axios";

import classNames from "classnames";

const BMap = window.BMap;

// 覆盖物样式
const labelStyle = {
    cursor: "pointer",
    border: "0px solid rgb(255, 0, 0)",
    padding: "0px",
    whiteSpace: "nowrap",
    fontSize: "12px",
    color: "rgb(255, 255, 255)",
    textAlign: "center"
};

class Map extends Component {
    state = {
        // 控制房源列表是否显示
        isShow: false,
        // 小区的房源数据
        houseList: []
    };

    componentDidMount() {
        this.initMap();
    }

    async initMap() {
        Toast.loading("loading...", 0);

        const { label, value } = await getCurrentCity();

        // 创建百度地图对象
        // 参数：表示地图容器的id值
        const map = new BMap.Map("container");
        this.map = map;
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(
            label,
            async point => {
                if (point) {
                    map.centerAndZoom(point, 11);
                    map.addControl(new BMap.ScaleControl());
                    map.addControl(new BMap.NavigationControl());

                    // 渲染覆盖物
                    await this.renderOverlays(value);

                    /* 
                        const {
                            data: { body: houseList }
                        } = await axios.get("http://localhost:8080/area/map", {
                            params: {
                                id: value
                            }
                        });

                        // 获取数据后，遍历数据生成覆盖物，显示在地图上
                        houseList.forEach(item => {
                            const { longitude, latitude } = item.coord;
                            const point = new BMap.Point(longitude, latitude);
                            const opts = {
                                position: point, // 指定文本标注所在的地理位置
                                offset: new BMap.Size(-35, -35) //设置文本偏移量
                            };
                            const label = new BMap.Label("", opts); // 创建文本标注对象
                            // 区、镇覆盖物结构：
                            label.setContent(`
                                <div class="${styles.bubble}">
                                <p class="${styles.name}">${item.label}</p>
                                <p>${item.count}套</p>
                                </div>
                            `);
                            label.setStyle(labelStyle);
                            label.addEventListener("click", e => {
                                console.log(item.value);
                            });
                            map.addOverlay(label);
                        }); 
                    */
                }
            },
            label
        );
    }

    /**
     * 获取数据后，渲染覆盖物，会被多次调用
     */
    async renderOverlays(id) {
        const res = await axios.get("http://localhost:8080/area/map", {
            params: {
                id
            }
        });
        const { type, nextZoom } = this.getTypeAndZoom();

        res.data.body.forEach(item => {
            this.createOverlays(type, item, nextZoom);
        });

        Toast.hide();
    }

    /**
     * 获取缩放级别以及渲染的覆盖物形状
     * 这里根据当前的缩放大小来判断改渲染什么形状
     * 11 和 13 type = circle
     * 15 type = rect
     */
    getTypeAndZoom() {
        // 获取当前的缩放级别
        const curZoom = this.map.getZoom();
        let nextZoom;
        let type = "circle";
        if (curZoom >= 10 && curZoom < 12) {
            // 第一次渲染的时候 渲染圆形( 区 房源数据)
            nextZoom = 13;
        } else if (curZoom >= 12 && curZoom < 14) {
            // 点击某一项后 渲染圆形(镇 房源数据)
            nextZoom = 15;
        } else {
            // 点击镇房源后渲染 小区房源数据（方形）
            type = "rect";
        }
        return { type, nextZoom };
    }

    // 创建覆盖物，判断是创建 圆的 还是 方的
    createOverlays(type, item, zoom) {
        // 通过判断 type 是 rect 或则是 circle
        if (type === "circle") {
            // 渲染圆形覆盖物
            this.createCircle(item, zoom);
        } else {
            // 渲染方形覆盖物,最后一级的时候不需要提供缩放级别了
            this.createRect(item);
        }
    }

    // 创建圆形覆盖物
    createCircle(item, zoom) {
        // 根据经纬度创建坐标中心点
        const { longitude, latitude } = item.coord;
        const point = new BMap.Point(longitude, latitude);

        const opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(-35, -35) //设置文本偏移量
        };
        const label = new BMap.Label("", opts); // 创建文本标注对象
        // 区、镇覆盖物结构：
        label.setContent(`
            <div class="${styles.bubble}">
                <p class="${styles.name}">${item.label}</p>
                <p>${item.count}套</p>
            </div>
        `);
        label.setStyle(labelStyle);
        label.addEventListener("click", e => {
            Toast.loading("loading...", 0);

            // 缩放地图
            this.map.centerAndZoom(point, zoom);

            // clearOverlays 这东西可能是异步的，所以这里直接使用会报个错误，因此这么用一下就行
            setTimeout(() => {
                // 清楚上一级覆盖物
                this.map.clearOverlays();
            }, 0);

            // 点击当前项渲染下级信息
            this.renderOverlays(item.value);
        });
        this.map.addOverlay(label);
    }

    // 创建方形覆盖物
    createRect(item) {
        // 根据经纬度创建坐标中心点
        const { longitude, latitude } = item.coord;
        const point = new BMap.Point(longitude, latitude);

        const opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(-50, -25) //设置文本偏移量
        };
        const label = new BMap.Label("", opts); // 创建文本标注对象
        // 区、镇覆盖物结构：
        label.setContent(`
            <div class="${styles.rect}">
                <span class="${styles.housename}">${item.label}</span>
                <span class="${styles.housenum}">${item.count}套</span>
                <i class="${styles.arrow}"></i>
            </div>
        `);
        label.setStyle(labelStyle);
        // 因为addEventListener 这个事件是百度地图自己提供的事件，调试发现这个时间不允许直接使用 async 因此这里需要把内部的操作另外封装一个方法
        // debugger
        label.addEventListener("click", e => {
            Toast.loading("loading...", 0);

            // 获取房源列表数据
            this.getCommunities(item.value);

            let x = window.innerWidth / 2 - e.changedTouches[0].clientX;
            let y =
                (window.innerHeight - 330 + 45) / 2 -
                e.changedTouches[0].clientY;
            // 将点击小区移动到地图可视区域中心
            this.map.panBy(x, y);
        });
        this.map.addOverlay(label);
    }

    // 获取小区房源数据
    async getCommunities(id) {
        let res = await axios.get(`http://localhost:8080/houses`, {
            params: {
                cityId: id
            }
        });

        this.setState({
            isShow: true,
            houseList: res.data.body.list
        });

        Toast.hide();
    }

    // 渲染小区房源列表
    renderHouseList() {
        return this.state.houseList.map(item => (
            <HouseItem {...item} houseImg={`${BASE_URL}${item.houseImg}`} />
        ));
    }

    render() {
        return (
            <div className={styles.map}>
                <NavHeader>地图找房</NavHeader>
                <div id="container" className={styles.container} />

                {/* 房屋列表结构 */}
                {/* <div className={[styles.houseList, styles.show].join(" ")}> */}
                <div
                    className={classNames(styles.houseList, {
                        [styles.show]: this.state.isShow
                    })}
                >
                    <div className={styles.titleWrap}>
                        <h1 className={styles.listTitle}>房屋列表</h1>
                        <a className={styles.titleMore} href="/house/list">
                            更多房源
                        </a>
                    </div>
                    <div className={styles.houseItems}>
                        {this.renderHouseList()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Map;
