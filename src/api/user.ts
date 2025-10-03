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

export interface Award {
    name: string;
    level: number; // 1-一等奖 2-二等奖 3-三等奖
}

export const set_profile = (data:{
    id:string,
    username: string,
    real_name: string,
    avatar: string,
    grade: number,
    student_no: string,
    codeforces_id: string,
    signature: string,
    awards: Award[],
}) => {
    return http.post('/api/user/profile',data)
}

export const set_role = (data:{ id: string, role: number }) => {
    return http.post('/api/user/role',data)
}

export const get_rankings = (data:{ page: number, count: number }) => {
    return http.get('/api/user/rankings', {
        params: data
    })
}

// 管理员用户管理接口
export const get_user_list = (data: { page: number, count: number }) => {
    return http.get('/api/user/list', {
        params: data
    })
}

export const delete_user = (data: { id: string }) => {
    return http.post('/api/user/delete', {
        id: data.id
    })
}