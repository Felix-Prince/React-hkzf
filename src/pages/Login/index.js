import React, { Component } from "react"
import { Flex, WingBlank, WhiteSpace, Toast } from "antd-mobile"

import { Link } from "react-router-dom"

import { withFormik, Form, Field, ErrorMessage } from "formik"
import * as yup from "yup"

import { API, setToken } from "../../utils"

import NavHeader from "../../components/NavHeader"

import styles from "./index.module.css"

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
    render() {
        // const {
        //     values,
        //     handleChange,
        //     handleSubmit,
        //     errors,
        //     touched,
        //     handleBlur
        // } = this.props;
        return (
            <div className={styles.root}>
                {/* 顶部导航 */}
                <NavHeader className={styles.navHeader}>账号登录</NavHeader>
                <WhiteSpace size="xl" />

                {/* 登录表单 */}
                <WingBlank>
                    <Form>
                        <div className={styles.formItem}>
                            {/* <input
                                className={styles.input}
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="username"
                                placeholder="请输入账号"
                            /> */}
                            {/* 使用 formik 提供的组件替换上面的 input */}
                            <Field
                                className={styles.input}
                                name="username"
                                placeholder="请输入账号"
                            />
                        </div>

                        {/* {touched.username && errors.username && (
                            <div className={styles.error}>
                                {errors.username}
                            </div>
                        )} */}
                        {/* 使用 errormessage 替换上面的 name 对应 errors 中的属性，component 的值表示渲染为一个div*/}
                        <ErrorMessage
                            className={styles.error}
                            name="username"
                            component="div"
                        />
                        <div className={styles.formItem}>
                            {/* <input
                                className={styles.input}
                                value={values.password}
                                onChange={handleChange}
                                onChange={handleChange}
                                name="password"
                                type="password"
                                placeholder="请输入密码"
                            /> */}
                            <Field
                                className={styles.input}
                                name="password"
                                type="password"
                                placeholder="请输入密码"
                            />
                        </div>
                        <ErrorMessage
                            className={styles.error}
                            name="password"
                            component="div"
                        />
                        <div className={styles.formSubmit}>
                            <button className={styles.submit} type="submit">
                                登 录
                            </button>
                        </div>
                    </Form>
                    <Flex className={styles.backHome}>
                        <Flex.Item style={{ textAlign: "center" }}>
                            <Link to="/registe">还没有账号，去注册~</Link>
                        </Flex.Item>
                    </Flex>
                </WingBlank>
            </div>
        )
    }
}

Login = withFormik({
    mapPropsToValues: () => ({ username: "test2", password: "test2" }),
    handleSubmit: async (values, { props }) => {
        const { username, password } = values
        let res = await API.post("/user/login", {
            username,
            password
        })
        const { status, description, body } = res.data

        if (status === 200) {
            // 登录成功
            setToken(body.token)
            if (!props.location.state) {
                props.history.go(-1)
            } else {
                props.history.replace(props.location.state.from.pathname)
            }
        } else {
            Toast.info(description, 2)
        }
    },
    validationSchema: yup.object().shape({
        username: yup
            .string()
            .required("账号为必填项")
            .matches(REG_UNAME, "长度为5到8位，只能出现数字、字母、下划线"),
        password: yup
            .string()
            .required("密码为必填项")
            .matches(REG_PWD, "长度为5到12位，只能出现数字、字母、下划线")
    })
})(Login)

export default Login
