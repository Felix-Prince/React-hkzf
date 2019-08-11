import React, { Component } from "react"

import { SearchBar } from "antd-mobile"

import { getCity, API } from "../../../utils"

import { debounce } from "lodash"

import styles from "./index.module.css"

export default class Search extends Component {
    // 当前城市id
    cityId = getCity().value

    state = {
        // 搜索框的值
        searchTxt: "",
        tipsList: []
    }

    // 渲染搜索结果列表
    renderTips = () => {
        const { tipsList } = this.state

        return tipsList.map(item => (
            <li
                key={item.community}
                className={styles.tip}
                onClick={() => this.handleClick(item)}
            >
                {item.communityName}
            </li>
        ))
    }

    handleClick = ({ community, communityName }) => {
        // console.log(community, communityName)
        this.props.history.replace("/rent/add", {
            community,
            communityName
        })
    }

    // 调用loadsh的防抖函数，返回一个新的函数
    search = debounce(async val => {
        const res = await API.get("/area/community", {
            params: {
                name: val,
                id: this.cityId
            }
        })

        this.setState({
            tipsList: res.data.body.map(item => ({
                community: item.community,
                communityName: item.communityName
            }))
        })
    }, 500)

    handleChange = val => {
        if (val.trim() === "") {
            return this.setState({
                searchTxt: "",
                tipsList: []
            })
        }
        this.setState({
            searchTxt: val
        })
        // 通过防抖的方式来减少请求的次数
        this.search(val)
    }

    render() {
        const { history } = this.props
        const { searchTxt } = this.state

        return (
            <div className={styles.root}>
                {/* 搜索框 */}
                <SearchBar
                    placeholder="请输入小区或地址"
                    value={searchTxt}
                    showCancelButton={true}
                    onChange={this.handleChange}
                    onCancel={() => history.replace("/rent/add")}
                />

                {/* 搜索提示列表 */}
                <ul className={styles.tips}>{this.renderTips()}</ul>
            </div>
        )
    }
}
