import http from '@/api/http'

export const my_info = () => {
    return http.get('/api/user/my-info')
}

export const get_profile = (data : {id: string}) => {
    return http.get('/api/user/profile',{
        params: {
            id: data.id
        }
    })
}