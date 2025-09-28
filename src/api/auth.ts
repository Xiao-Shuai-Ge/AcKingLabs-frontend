import http from '@/api/http'
import {useUserStore} from "@/store/user";

export const login = (data : {email: string, password : string , is_remember : boolean}) => {
    return http.post('/api/login/login', data)
}

export const register = (data : {email: string, password: string, username: string , code : string, invitation_code : string}) => {
    return http.post('/api/login/register', data)
}

export const refreshToken = async () => {
    const UserStore = useUserStore();

    console.log("开始刷新token")

    const rtoken = UserStore.getRtoken()
    if (!rtoken) throw new Error('No refresh token available')

    console.log("发送刷新token请求", rtoken)
    const response = await http.post('/api/login/refresh-token', {
        rtoken: rtoken
    })
    console.log("刷新token成功", response.data.data.atoken)
    UserStore.setAtoken(response.data.data.atoken)
}

export const send_code = (data : {email: string}) => {
    return http.post('/api/login/send-code', data)
}

export const test_token = () => {
    return http.get('/api/login/test')
}

export const resetPassword = (data: {email: string, code: string, password: string}) => {
    return http.post('/api/login/reset-password', data)
}


