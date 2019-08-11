import React, { Component } from "react"

import { Link } from "react-router-dom"
import { Grid, Button, Modal } from "antd-mobile"

import { BASE_URL, isAuth, API, removeToken } from "../../../utils"

import styles from "./index.module.css"

// 菜单数据
const menus = [
    { id: 1, name: "我的收藏", iconfont: "icon-coll", to: "/favorate" },
    { id: 2, name: "我的出租", iconfont: "icon-ind", to: "/rent" },
    { id: 3, name: "看房记录", iconfont: "icon-record" },
    {
        id: 4,
        name: "成为房主",
        iconfont: "icon-identity"
    },
    { id: 5, name: "个人资料", iconfont: "icon-myinfo" },
    { id: 6, name: "联系我们", iconfont: "icon-cust" }
]

// 默认头像
const DEFAULT_AVATAR = "/img/profile/avatar.png"
const DEFAULT_NICKNAME = "游客"

const alert = Modal.alert

export default class Profile extends Component {
    state = {
        // 初始通过判断token是否存在来确定用户是否登录了
        isLogin: isAuth(),
        // 用户的信息
        userInfo: {
            avatar: DEFAULT_AVATAR,
            nickname: DEFAULT_NICKNAME
        }
    }

    componentDidMount() {
        this.getUserInfo()
    }

    // 获取个人资料
    async getUserInfo() {
        // 没有登录的时候，不发送请求
        if (!this.state.isLogin) return

        // 登录了，就发送请求，获取用户个人资料,请求中的headers 配置再了API中
        const res = await API.get("/user")

        const { status, body } = res.data

        if (status === 400) {
            // 登录失败：token异常或者过期
            // 此时，就直接移除 token
            // 修改为在 api.js 中配置的响应拦截器中执行了
            // removeToken()
            // 重置登录状态，因为token失效，所以，实际此时就是没有登录。那么，将 isLogin 设置为 false即可
            this.setState({
                isLogin: false
            })
        } else if (status === 200) {
            this.setState({
                userInfo: body
            })
        }
    }

    // 退出
    logout = () => {
        alert("提示", "是否确定退出?", [
            { text: "取消" },
            {
                text: "退出",
                onPress: async () => {
                    // 调用接口，执行退出
                    await API.post("/user/logout")
                    // 本地删除token
                    removeToken()

                    this.setState({
                        isLogin: false,
                        userInfo: {}
                    })
                }
            }
        ])
    }
    render() {
        const { history } = this.props
        const {
            isLogin,
            userInfo: { avatar, nickname }
        } = this.state
        return (
            <div className={styles.root}>
                {/* 个人信息 */}
                <div className={styles.title}>
                    <img
                        className={styles.bg}
                        src={BASE_URL + "/img/profile/bg.png"}
                        alt="背景图"
                    />
                    <div className={styles.info}>
                        <div className={styles.myIcon}>
                            <img
                                className={styles.avatar}
                                src={
                                    BASE_URL +
                                    (isLogin ? avatar : DEFAULT_AVATAR)
                                }
                                alt="icon"
                            />
                        </div>
                        <div className={styles.user}>
                            <div className={styles.name}>
                                {isLogin ? nickname : DEFAULT_NICKNAME}
                            </div>
                            {isLogin ? (
                                // 登录后展示：
                                <>
                                    <div className={styles.auth}>
                                        <span onClick={this.logout}>退出</span>
                                    </div>
                                    <div className={styles.edit}>
                                        编辑个人资料
                                        <span className={styles.arrow}>
                                            <i className="iconfont icon-arrow" />
                                        </span>
                                    </div>
                                </>
                            ) : (
                                // 未登录展示：
                                <div className={styles.edit}>
                                    <Button
                                        type="primary"
                                        size="small"
                                        inline
                                        onClick={() => history.push("/login")}
                                    >
                                        去登录
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 九宫格菜单 */}
                <Grid
                    data={menus}
                    columnNum={3}
                    hasLine={false}
                    renderItem={item =>
                        item.to ? (
                            <Link to={item.to}>
                                <div className={styles.menuItem}>
                                    <i
                                        className={`iconfont ${item.iconfont}`}
                                    />
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        ) : (
                            <div className={styles.menuItem}>
                                <i className={`iconfont ${item.iconfont}`} />
                                <span>{item.name}</span>
                            </div>
                        )
                    }
                />

                {/* 加入我们 */}
                <div className={styles.ad}>
                    <img src={BASE_URL + "/img/profile/join.png"} alt="" />
                </div>
            </div>
        )
    }
}
