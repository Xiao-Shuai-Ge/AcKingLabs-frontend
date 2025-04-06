import http from '@/api/http'

export const test = () => {
    return http.get('/api/common/test')
}