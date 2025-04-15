import http from "@/api/http";

export const get_message_count = () => {
    return http.get('/api/message/count')
}

export const get_message_list = (data: { type : string }) => {
    return http.get('/api/message/list', {
        params: data
    })
}

export const mark_message_read = (data : {message_id: string}) => {
    return http.post('/api/message/read', data)
}