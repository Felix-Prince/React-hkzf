import React from 'react'

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

// 导入页面组件
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <div className='app'>
                    {/* 通过重定向，让默认路由导航到home页 */}
                    <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
                    <Route path="/home" component={Home}></Route>
                    <Route path="/citylist" component={CityList}></Route>
                    <Route path="/map" component={Map}></Route>
                </div>
            </Router>
        )
    }
}