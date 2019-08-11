import React, { lazy, Suspense } from "react"

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"

import AuthRoute from "./components/AuthRoute"

// 导入页面组件
import Home from "./pages/Home"
const CityList = lazy(() => import("./pages/CityList"))
const Map = lazy(() => import("./pages/Map"))
const Details = lazy(() => import("./pages/Details"))
const Login = lazy(() => import("./pages/Login"))
const Rent = lazy(() => import("./pages/Rent"))
const RentAdd = lazy(() => import("./pages/Rent/Add"))
const RentSearch = lazy(() => import("./pages/Rent/Search"))
// const Map = React.lazy(() => import("./pages/Map"));

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <Suspense fallback={<div>loading...</div>}>
                    <div className="app">
                        {/* 通过重定向，让默认路由导航到home页 */}
                        <Route
                            exact
                            path="/"
                            render={() => <Redirect to="/home" />}
                        />
                        <Route path="/home" component={Home} />
                        <Route path="/citylist" component={CityList} />
                        {/* <React.Suspense fallback={<div>loading...</div>}>
                        <Route path="/map" component={Map} />
                    </React.Suspense> */}
                        <Route path="/map" component={Map} />
                        <Route path="/details/:id" component={Details} />
                        <Route path="/login" component={Login} />

                        <AuthRoute exact path="/rent" component={Rent} />
                        <AuthRoute path="/rent/add" component={RentAdd} />
                        <AuthRoute path="/rent/search" component={RentSearch} />
                    </div>
                </Suspense>
            </Router>
        )
    }
}
