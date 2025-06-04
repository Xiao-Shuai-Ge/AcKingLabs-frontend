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

export const get_contest = (data : {
    contest_id: string
}) => {
    return http.get('/api/contest/detail',{
        params: data
    })
}

export const create_contest = (data : {
    title: string,
    start_time: number,
    end_time: number,
    url: string,
}) => {
    return http.post('/api/contest/create',data)
}

export const create_booking = (data : {
    contest_id: string,
}) => {
    return http.post('/api/contest/booking',data)
}

export const get_booking = (data : {
    contest_id: string,
}) => {
    return http.get('/api/contest/booking',{
        params: data
    })
}

export const set_recommend = (data : {
    contest_id: string,
    is_recommend: boolean,
}) => {
    return http.post('/api/contest/recommend',data)
}