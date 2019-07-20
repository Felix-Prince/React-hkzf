import React from 'react'

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

// 导入页面组件
import Home from './pages/Home'
import CityList from './pages/CityList'

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    {/* 通过重定向，让默认路由导航到home页 */}
                    <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
                    <Route path="/home" component={Home}></Route>
                    <Route path="/list" component={CityList}></Route>
                </div>
            </Router>
        )
    }
}