import React from "react";

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// 导入页面组件
import Home from "./pages/Home";
import CityList from "./pages/CityList";
import Map from "./pages/Map";
import Details from "./pages/Details";
// const Map = React.lazy(() => import("./pages/Map"));

export default class App extends React.Component {
    render() {
        return (
            <Router>
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
                </div>
            </Router>
        );
    }
}
