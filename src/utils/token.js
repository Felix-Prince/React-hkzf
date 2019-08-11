const TOKEN = "hkzf_token";

// 获取token
const getToken = () => localStorage.getItem(TOKEN);
// 设置token
const setToken = token => localStorage.setItem(TOKEN, token);
// 移除token
const removeToken = () => localStorage.removeItem(TOKEN);
// 判单是否登录
const isAuth = () => !!getToken();

export { getToken, setToken, removeToken, isAuth };
