import React, { Component } from "react";

// 导入组件
import { Toast } from "antd-mobile";

// 导入axios
import axios from "axios";

// 导入样式
import "./index.scss";

// 导入工具函数
import { getCurrentCity, setCity } from "../../utils";

import { List, AutoSizer } from "react-virtualized";

import NavHeader from "../../components/NavHeader";

/**
 * 对获取到的城市列表数据进行格式化
 * 一个是 城市首字母的数组 ['a', 'b']
 * 一个是 城市列表对象，以首字母为属性的{ a: [{}, {}], b: [{}, ...] }
 * list是无需的列表数据
 */
const formatCityList = list => {
    const cityList = {};

    list.forEach(item => {
        // 获取首字母
        const firstChar = item.short.substr(0, 1);
        // 判断在citylist中是否有这个属性，如果没有就添加属性，如果有就在属性值（数组）中,继续追加
        if (firstChar in cityList) {
            cityList[firstChar].push(item);
        } else {
            cityList[firstChar] = [item];
        }
    });

    // 根据对象的 keys 方法获取属性名
    const cityIndex = Object.keys(cityList).sort();

    return {
        cityList,
        cityIndex
    };
};

// 列表的标题高
const TITLE_HEIGHT = 36;
// 每一个城市的行高
const CITY_HEIGHT = 50;

// 暂定只有北上广深有房源
const CITY_HAS_HOUSE = ["北京", "上海", "广州", "深圳"];

class CityList extends Component {
    state = {
        // 城市列表数据
        cityList: {},
        // 城市首字母索引
        cityIndex: [],
        // 默认第一个索引激活
        activeIndex: 0
    };

    refList = React.createRef();

    // 获取城市列表数据
    async getCityList() {
        // 获取所有的城市列表数据
        let res = await axios.get("http://localhost:8080/area/city?level=1");
        const { cityList, cityIndex } = formatCityList(res.data.body);

        // 获取热门城市数据
        let hotCity = await axios.get("http://localhost:8080/area/hot");
        // 把热门城市数据添加到 citylist 中，添加索引到 cityindex 的前面
        cityIndex.unshift("hot");
        cityList["hot"] = hotCity.data.body;

        // 获取定位的当前城市信息
        let curCity = await getCurrentCity();
        cityIndex.unshift("#");
        cityList["#"] = [curCity];

        // console.log(cityList, cityIndex)

        this.setState({
            cityIndex,
            cityList
        });
    }

    // 点击每一项，切换城市
    changeCity = ({ label, value }) => {
        if (CITY_HAS_HOUSE.indexOf(label) !== -1) {
            // 北上广深之一
            // 存储到本地缓存中
            setCity({ label, value });
            // 并且返回上一页
            this.props.history.go(-1);
        } else {
            // 其他城市
            Toast.info("该城市暂无房源数据");
        }
    };

    // 生成列表结构
    formatCityList = index => {
        const { cityIndex, cityList } = this.state;
        // 通过索引获取索引数组中的首字母
        const letter = cityIndex[index];
        // 通过首字母获取对应的城市列表
        const list = cityList[letter];
        return list.map(item => (
            <div
                className="name"
                key={item.value}
                onClick={() => this.changeCity(item)}
            >
                {item.label}
            </div>
        ));
    };

    // 设置每一项的标题
    formatTitle = index => {
        const { cityIndex } = this.state;
        switch (cityIndex[index]) {
            case "#":
                return "当前城市";
            case "hot":
                return "热门城市";
            default:
                return cityIndex[index].toUpperCase();
        }
    };

    formatIndex = index => {
        return index === "hot" ? "热" : index.toUpperCase();
    };

    // 动态计算城市列表的行高
    calRowHeight = ({ index }) => {
        // 行高 = title高 + 每个城市行高 * 该title下城市数量
        const { cityIndex, cityList } = this.state;
        // 通过索引获取索引数组中的首字母
        const letter = cityIndex[index];
        // 通过首字母获取对应的城市列表
        const list = cityList[letter];

        // 为了让 最后一个字母也可以滚动到顶部，因此这里让最后一个行高是整个屏幕
        return index === cityIndex.length - 1
            ? window.innerHeight
            : TITLE_HEIGHT + list.length * CITY_HEIGHT;
    };

    // 渲染城市列表数据
    rowRenderer = ({ key, index, style }) => {
        return (
            <div key={key} style={style} className="city">
                <div className="title">{this.formatTitle(index)}</div>
                {this.formatCityList(index)}
            </div>
        );
    };

    // 点击索引，切换城市列表
    scrollIndex = index => {
        this.refList.current.scrollToRow(index);
    };

    renderIndex() {
        return this.state.cityIndex.map((item, index) => (
            <li
                className="city-index-item"
                key={item}
                onClick={() => this.scrollIndex(index)}
            >
                {/* index-active */}
                <span
                    className={
                        index === this.state.activeIndex ? "index-active" : ""
                    }
                >
                    {this.formatIndex(item)}
                </span>
            </li>
        ));
    }

    onRowsRendered = ({ startIndex }) => {
        // console.log(startIndex)
        if (startIndex !== this.state.activeIndex) {
            this.setState({
                activeIndex: startIndex
            });
        }
    };

    async componentDidMount() {
        // 数据的获取设置都是异步的，等这里设置好了，才可以执行下面的计算
        await this.getCityList();
        // 因为 scrollToRow 自身原因，因此这里需要先全部计算一下列表的高度
        this.refList.current.measureAllRows();
    }

    render() {
        return (
            <div className="citylist">
                <NavHeader>城市选择</NavHeader>

                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            ref={this.refList}
                            width={width}
                            height={height}
                            rowCount={this.state.cityIndex.length}
                            rowHeight={this.calRowHeight}
                            rowRenderer={this.rowRenderer}
                            onRowsRendered={this.onRowsRendered}
                            scrollToAlignment="start"
                        />
                    )}
                </AutoSizer>

                <ul className="city-index">{this.renderIndex()}</ul>
            </div>
        );
    }
}

export default CityList;
