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

export const get_auto_list = () => {
    return http.get('/api/common/auto-list')
}

export const save_auto_setting = (data: {
    is_auto: boolean,
    class_id: number,
    course_id: number,
    course_name: string,
    percent: number,
}) => {
    return http.post('/api/common/auto-setting',data)
}