import http from '@/api/http'

export const create_post = (data : {
    title : string,
    content : string,
    type : string,
    source : string,
    is_private: boolean,
}) => {
    return http.post('/api/post/create',data)
}

export const get_post_detail = (data : {id: string}) => {
    return http.get(`/api/post/detail`,{
        params: data
    })
}

export const get_like_post = (data : {post_id: string}) => {
    return http.get(`/api/post/like-post`,{
        params: data
    })
}

export const like_post = (data : {post_id: string}) => {
    return http.post(`/api/post/like-post`,data)
}