import http from '@/api/http'

export const my_info = () => {
    return http.get('/api/user/my-info')
}