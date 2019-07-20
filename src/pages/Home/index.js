import React, { Component } from 'react';
import { Route } from 'react-router-dom'

// 导入组件
import { TabBar } from 'antd-mobile';

// 导入样式
import './index.scss'

// 导入子路由页面
import Index from './Default'
import HouseList from './HouseList'
import News from './News'
import Profile from './Profile'


// 定义TabBar数据
const TABBARLIST = [
    { title: '首页', icon: 'icon-ind', path: "/home" },
    { title: '找房', icon: 'icon-findHouse', path: "/home/houselist" },
    { title: '资讯', icon: 'icon-infom', path: "/home/news" },
    { title: '我的', icon: 'icon-my', path: "/home/profile" }
]

class Home extends Component {
    state = {
        // 根据路由来判断哪一个tabbar选中
        selectedTab: this.props.location.pathname
    };

    renderTabBarItems = () => {
        return (
            TABBARLIST.map(val => (
                <TabBar.Item
                    icon={<i className={`iconfont ${val.icon}`}></i>}
                    selectedIcon={<i className={`iconfont ${val.icon}`}></i>}
                    title={val.title}
                    key={val.path}
                    selected={this.state.selectedTab === val.path}
                    onPress={() => {
                        // 点击tabbar的时候跳转路由，并且修改选中的tabbar
                        this.props.history.push(val.path)
                        // 因为切换tabbar触发的是 更新阶段 ，所以这里必须使用setState再修改一下值
                        this.setState({
                            selectedTab: val.path,
                        });
                    }}
                >
                </TabBar.Item>
            ))
        )
    }
    render() {
        return (
            <div className="home">
                <Route exact path="/home" component={Index}></Route>
                <Route path="/home/houselist" component={HouseList}></Route>
                <Route path="/home/news" component={News}></Route>
                <Route path="/home/profile" component={Profile}></Route>


                {/* 底部tabbar */}
                <div className="tabbar" >
                    <TabBar tintColor="#21b97a" barTintColor="white" noRenderContent={true}>
                        {this.renderTabBarItems()}
                    </TabBar>
                </div>

            </div>
        );
    }
}

export default Home;