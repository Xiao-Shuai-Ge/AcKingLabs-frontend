import axios, {AxiosError} from 'axios'
import {useUserStore} from "@/store/user";

// 创建axios实例
const http = axios.create({
    //baseURL: "http://localhost:8080",
    baseURL: "http://120.79.250.47:8080",
    timeout: 10000
})

// 获取token的函数（方便后续更换存储方式）
const getAToken = () => localStorage.getItem('atoken')
const getRToken = () => localStorage.getItem('rtoken')

// 请求拦截器
http.interceptors.request.use(config => {
    const token = getAToken()
    //console.log("请求拦截器")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 添加闭包变量控制刷新状态和队列
let isRefreshing = false
let queuedRequests: ((token: string) => void)[] = []



// 响应拦截器
http.interceptors.response.use(
    response => {
        const UserStore = useUserStore()
        // 检查业务代码是否为-20000
        if (response.data?.code === -20000) {

            console.log("token失效，开始刷新token")
            const originalRequest = response.config

            if (!isRefreshing) {
                isRefreshing = true

                return refreshToken()
                    .then(newAToken => {
                        // 1. 存储新token
                        UserStore.setAtoken(newAToken)

                        // 2. 更新后续请求的默认headers
                        http.defaults.headers.common.Authorization = `Bearer ${newAToken}`

                        // 3. 重发队列中的请求
                        queuedRequests.forEach(cb => cb(newAToken))
                        queuedRequests = []

                        // 4. 重发原始请求
                        originalRequest.headers.Authorization = `Bearer ${newAToken}`
                        return http(originalRequest)
                    })
                    .catch(error => {
                        if (response.config.url === '/api/user/my-info') {
                            // 无需跳转
                            console.log("用户未登录，显示空白头像")
                            return response
                        }

                        // 刷新失败时清理token并跳转登录
                        UserStore.logout()
                        window.location.href = '/login'
                        return Promise.reject(error)
                    })
                    .finally(() => {
                        isRefreshing = false
                    })
            }

            // 已有正在刷新的请求，将当前请求加入队列
            return new Promise((resolve) => {
                queuedRequests.push((newAToken: string) => {
                    originalRequest.headers.Authorization = `Bearer ${newAToken}`
                    resolve(http(originalRequest))
                })
            })
        }
        return response
    },
    error => {
        // 处理其他类型的响应错误
        return Promise.reject(error)
    }
)

// 刷新Token的函数
async function refreshToken() {
    const rtoken = getRToken()
    if (!rtoken) throw new Error('No refresh token available')

    console.log("发送刷新token请求", rtoken)
    const response = await http.post('/api/login/refresh-token', {
        rtoken: rtoken
    })
    console.log("刷新token成功", response.data.data.atoken)
    return response.data.data.atoken
}

export default http