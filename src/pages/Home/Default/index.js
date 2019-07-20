import React, { Component } from 'react';

// 导入轮播图组件
import { Carousel } from 'antd-mobile';

// 导入页面样式
import './index.scss'

// 导入axios
import axios from 'axios'


class index extends Component {
    state = {
        // 轮播图数据
        swiper: [],
        // 轮播图图片的高度
        imgHeight: 212,
        // 轮播图数据是否加载中
        isSwiperLoading: true
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

    // 在挂载完成钩子函数中调用获取数据
    componentDidMount() {
        // simulate img loading
        // 发送请求获取轮播图数据
        this.getSwipers()
    }

    render() {
        return (
            <div className="swiper">
                {/* 
                    这么处理的目的：因为轮播图组件的数据如果一开始没有值，即swiper是空数组时，就会导致轮播图一开始不会自动播放 
                    下面这么处理表示：当轮播图数据加载完毕后再去渲染轮播图组件
                    （这个bug是人家组件自带的）
                */}
                {
                    !this.state.isSwiperLoading &&
                    (<Carousel autoplay={true} infinite autoplayInterval={1000}>
                        {this.renderSwiper()}
                    </Carousel>)
                }
            </div>
        );
    }
}

export default index;