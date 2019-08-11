import axios from "axios"
import { BASE_URL } from "./url"
import { getToken, removeToken } from "./token"

const API = axios.create({
    baseURL: BASE_URL
})

// 请求拦截器
API.interceptors.request.use(config => {
    const { url } = config
    if (
        url.startsWith("/user") &&
        !(url.startsWith("/user/login") || url.startsWith("/user/registered"))
    ) {
        config.headers.authorization = getToken()
    }

    return config
})

// 响应拦截器
API.interceptors.response.use(res => {
    const { status } = res.data
    if (status === 400) {
        // token 失效或者获取数据失败
        removeToken()
    }
    return res
})

export { API }
