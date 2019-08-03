import React, { Component } from "react";

import SearchHeader from "../../../components/SearchHeader";

import { API, getCurrentCity, BASE_URL } from "../../../utils";
import { Flex, Toast } from "antd-mobile";

import Filter from "./components/Filter";
import HouseItem from "../../../components/HouseItem";
import Sticky from "../../../components/Sticky";
import NoHouse from "../../../components/NoHouse";

import {
    List,
    AutoSizer,
    WindowScroller,
    InfiniteLoader
} from "react-virtualized";

import styles from "./index.module.scss";

const HOUSE_ITEM_HEIGHT = 120;

class HouseList extends Component {
    state = {
        list: [],
        count: 0,
        // 数据尚未加载完成
        isLoaded: false
    };
    filters = {};
    value = ""; // 当前城市id
    label = ""; // 当前城市名称
    onFilter = filters => {
        this.filters = filters;
        this.searchHouseList();

        // 重新筛选数据后，页面滚动到顶部
        window.scrollTo(0, 0);
    };

    async searchHouseList(startIndex = 1, stopIndex = 20) {
        Toast.loading("loading...", 0);
        let res = await API.get("/houses", {
            params: {
                ...this.filters,
                cityId: this.value,
                start: startIndex,
                end: stopIndex
            }
        });

        Toast.hide();

        const { list, count } = res.data.body;

        if (count > 0) Toast.info(`共找到房源${count}套`, 1.5);

        this.setState({
            list,
            count,
            isLoaded: true
        });
    }
    async componentDidMount() {
        const { value, label } = await getCurrentCity();
        this.value = value;
        this.label = label;
        this.searchHouseList();
    }

    rowRenderer = ({ key, index, style }) => {
        const { list } = this.state;
        const item = list[index];

        if (!item) {
            return (
                <div key={key} style={style}>
                    <p className={styles.loading} />
                </div>
            );
        }

        return (
            <HouseItem
                key={key}
                style={style}
                {...item}
                houseImg={`${BASE_URL}${item.houseImg}`}
                onClick={() =>
                    this.props.history.push(`/details/${item.houseCode}`)
                }
            />
        );
    };

    isRowLoaded = ({ index }) => {
        return !!this.state.list[index];
    };

    loadMoreRows = ({ startIndex, stopIndex }) => {
        return new Promise(async resolve => {
            // this.searchHouseList(startIndex, stopIndex);
            let res = await API.get("/houses", {
                params: {
                    ...this.filters,
                    cityId: this.value,
                    start: startIndex,
                    end: stopIndex
                }
            });

            const { list, count } = res.data.body;

            this.setState({
                list: [...this.state.list, ...list],
                count,
                isLoaded: true
            });

            resolve();
        });
    };

    // 渲染房源列表
    renderHouseList() {
        const { count, isLoaded } = this.state;

        if (count <= 0 && isLoaded) {
            return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>;
        }

        return (
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={this.state.count}
                minimumBatchSize={11}
            >
                {({ onRowsRendered, registerChild }) => (
                    <WindowScroller>
                        {({ height, isScrolling, scrollTop }) => (
                            <AutoSizer>
                                {({ width }) => (
                                    <List
                                        autoHeight
                                        width={width}
                                        height={height}
                                        rowCount={this.state.count}
                                        rowHeight={HOUSE_ITEM_HEIGHT}
                                        rowRenderer={this.rowRenderer}
                                        ref={registerChild}
                                        onRowsRendered={onRowsRendered}
                                        isScrolling={isScrolling}
                                        scrollTop={scrollTop}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </WindowScroller>
                )}
            </InfiniteLoader>
        );
    }

    render() {
        return (
            <div className={styles.root}>
                {/* 顶部搜索 */}
                <Flex className={styles.topSearch}>
                    <i
                        className="iconfont icon-back"
                        onClick={() => this.props.history.go(-1)}
                    />
                    <SearchHeader
                        cityName={this.label}
                        className={styles.listSearch}
                    />
                </Flex>

                {/* 筛选部分 */}

                {/* 给吸顶组件传入需要吸顶组件的高度，这样就可以让该组件使用起来更灵活 */}
                <Sticky height={40}>
                    <Filter onFilter={this.onFilter} />
                </Sticky>

                {/* 渲染房源列表 */}
                <div className={styles.houseList}>{this.renderHouseList()}</div>
            </div>
        );
    }
}

export default HouseList;
