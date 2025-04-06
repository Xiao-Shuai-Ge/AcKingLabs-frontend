import http from '@/api/http'

export const login = (data : {email: string, password : string , is_remember : boolean}) => {
    return http.post('/api/login/login', data)
}

export const register = (data : {email: string, password: string, username: string , code : string}) => {
    return http.post('/api/login/register', data)
}

export const send_code = (data : {email: string}) => {
    return http.post('/api/login/send-code', data)
}

export const test_token = () => {
    return http.get('/api/login/test')
}


