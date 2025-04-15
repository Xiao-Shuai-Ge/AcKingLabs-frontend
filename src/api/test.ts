import http from '@/api/http'

export const test = () => {
    return http.get('/api/common/test')
}

export const signin_list = () => {
    return http.get('/api/common/signin-list')
}

export const signin = (data : {
    user_id: number,
    class_id: number,
    relation_id: number
}) => {
    return http.post('/api/common/signin',data)
}

export const signin_teacher = (data : {
    user_id: number,
    relation_id: number
}) => {
    return http.post('/api/common/signin-teacher',data)
}