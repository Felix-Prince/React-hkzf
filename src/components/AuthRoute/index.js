import React from "react"

import { Redirect, Route } from "react-router-dom"

import { isAuth } from "../../utils"

// 使用方式：<AuthRoute path="/rent/add" component={Rent} />
const AuthRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                if (isAuth()) {
                    // 已经登录，表示有权限跳转到该页面
                    return <Component {...props} />
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: props.location }
                            }}
                        />
                    )
                }
            }}
        />
    )
}

export default AuthRoute
