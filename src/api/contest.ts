import http from "@/api/http";

export const get_contest_list = (data : {
    type: string
    page: number
    count: number
}) => {
    return http.get('/api/contest/list',{
        params: data
    })
}