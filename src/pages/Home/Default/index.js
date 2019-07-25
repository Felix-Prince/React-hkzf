import React, { Component } from 'react';

// 导入轮播图组件
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';

import { Link } from 'react-router-dom'
// 导入页面样式
import './index.scss'

// 导入axios
import axios from 'axios'

// 导入工具函数
import { getCurrentCity } from '../../../utils'

import nav1 from "../../../assets/images/nav-1.png"
import nav2 from "../../../assets/images/nav-2.png"
import nav3 from "../../../assets/images/nav-3.png"
import nav4 from "../../../assets/images/nav-4.png"


// navMenu 部分数据
const NAVMENU = [
    { src: nav1, desc: '整租', path: '/home/houselist' },
    { src: nav2, desc: '合租', path: '/home/houselist' },
    { src: nav3, desc: '地图找房', path: '/map' },
    { src: nav4, desc: '去出租', path: '/rent/add' },
]




class index extends Component {
    state = {
        // 轮播图数据
        swiper: [],
        // 租房小组数据
        groups: [],
        // 新闻资讯数据
        news: [],
        // 轮播图图片的高度
        imgHeight: 212,
        // 轮播图数据是否加载中
        isSwiperLoading: true,
        // 定位的当前城市名称
        cityName: ''
    }

    /**
     * 获取轮播图数据
     */
    getSwipers = async () => {
        let res = await axios.get('http://localhost:8080/home/swiper')
        this.setState({
            swiper: res.data.body,
            isSwiperLoading: false
        })
    }

    /**
     * 获取租房小组数据
     */
    async getGroups() {
        let res = await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
        // console.log(res)
        this.setState(() => ({
            groups: res.data.body
        }))
    }

    /**
     * 获取新闻资讯数据
     */
    async getNews() {
        let res = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')

        this.setState(() => ({ news: res.data.body }))
    }

    /**
     * 把渲染轮播图的提取出来，保证render的简洁
     */
    renderSwiper = () => {
        return (
            this.state.swiper.map(val => (
                <a
                    key={val.id}
                    href="http://www.alipay.com"
                    style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                >
                    <img
                        src={`http://localhost:8080${val.imgSrc}`}
                        alt=""
                        style={{ width: '100%', verticalAlign: 'top' }}
                        onLoad={() => {
                            // fire window resize event to change height
                            // 给window增加resize事件，当页面调整大小时修改img高度
                            window.dispatchEvent(new Event('resize'));
                            this.setState({ imgHeight: 'auto' });
                        }}
                    />
                </a>
            ))
        )
    }


    /**
     * 渲染中间菜单部分
     */
    renderNavMenu() {
        return NAVMENU.map(item => (
            <Flex.Item key={item.src}>
                <Link to={item.path}>
                    <img src={item.src} alt="" />
                    <p>{item.desc}</p>
                </Link>
            </Flex.Item>
        ))
    }

    /**
     * 渲染新闻资讯
     */
    renderNewsList() {
        return this.state.news.map(item => (
            <Flex className="news-item" justify='between' key={item.id}>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                <Flex className="item-desc" justify='between' direction='column'>
                    <h3>{item.title}</h3>
                    <Flex justify='between' className='item-time'>
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </Flex>
                </Flex>
            </Flex>
        ))
    }

    // 在挂载完成钩子函数中调用获取数据
    async componentDidMount() {
        // simulate img loading
        // 发送请求获取轮播图数据
        this.getSwipers()
        // 发送请求获取租房小组数据
        this.getGroups()
        // 发送请求获取新闻资讯数据
        this.getNews()
        // 获取当前定位城市信息
        let { label } = await getCurrentCity()

        this.setState({
            cityName: label
        })
    }

    render() {
        return (
            <div className="index">
                <div className="swiper">

                    <Flex className="search-box">
                        <Flex className="search-left">
                            <div className="location" onClick={() => this.props.history.push("/citylist")}>
                                <span>{this.state.cityName}</span>
                                <i className="iconfont icon-arrow"></i>
                            </div>
                            <div className="search" onClick={() => this.props.history.push('/search')}>
                                <Flex>
                                    <i className="iconfont icon-seach"></i>
                                    <span>请输入小区或地址</span>
                                </Flex>
                            </div>
                        </Flex>
                        <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')}></i>
                    </Flex>

                    {/* 
                    这么处理的目的：因为轮播图组件的数据如果一开始没有值，即swiper是空数组时，就会导致轮播图一开始不会自动播放 
                    下面这么处理表示：当轮播图数据加载完毕后再去渲染轮播图组件
                    （这个bug是人家组件自带的）
                */}
                    {
                        !this.state.isSwiperLoading &&
                        (<Carousel autoplay={false} infinite autoplayInterval={1000}>
                            {this.renderSwiper()}
                        </Carousel>)
                    }

                </div>

                {/* 菜单部分 */}
                <Flex className="navMenu">
                    {this.renderNavMenu()}
                </Flex>

                {/* 租房小组部分 */}
                <div className="groups">
                    <Flex className="groups-title" justify='between'>
                        <h3>租房小组</h3>
                        <span>更多</span>
                    </Flex>
                    <Grid data={this.state.groups} activeStyle={true} columnNum={2} square={false} hasLine={false} renderItem={(el) => (
                        <Flex justify='around'>
                            <div>
                                <p>{el.title}</p>
                                <span>{el.desc}</span>
                            </div>
                            <img src={`http://localhost:8080${el.imgSrc}`} alt="" />
                        </Flex>
                    )} />
                </div>

                {/* 最新资讯部分 */}
                <div className="news">
                    <h3>最新资讯</h3>
                    <WingBlank size='md'>
                        {this.renderNewsList()}
                    </WingBlank>
                </div>
            </div>
        );
    }
}

export default index;