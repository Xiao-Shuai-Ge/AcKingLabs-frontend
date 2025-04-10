import http from '@/api/http'

export const my_info = () => {
    return http.get('/api/user/my-info')
}

export const get_user_info = (data : {id: string}) => {
    return http.get('/api/user/info',{
        params: {
            id: data.id
        }
    })
}

export const get_user_profile = (data : {id: string}) => {
    return http.get('/api/user/profile',{
        params: {
            id: data.id
        }
    })
}

export const set_profile = (data:{
    id:string,
    username: string,
    real_name: string,
    avatar: string,
    grade: number,
    student_no: string,
    codeforces_id: string,
}) => {
    return http.post('/api/user/profile',data)
}

export const set_role = (data:{ id: string, role: number }) => {
    return http.post('/api/user/role',data)
}