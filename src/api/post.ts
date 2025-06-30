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

export const edit_post = (data : {
    post_id : string,
    title : string,
    content : string,
    type : string,
    source : string,
    is_private: boolean,
}) => {
    return http.post('/api/post/edit',data)
}

export const delete_post = (data : {post_id: string}) => {
    return http.post('/api/post/delete',data)
}

export const get_post_detail = (data : {id: string}) => {
    return http.get(`/api/post/detail`,{
        params: data
    })
}

export const get_post_detail_visitor = (data : {id: string}) => {
    return http.get(`/api/post/detail-visitor`,{
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

export const create_comment = (data : {
    post_id: string,
    father_id: string,
    content: string,
}) => {
    return http.post('/api/post/comment',data)
}

export const get_more_comment = (data : {
    id: string
    is_child: boolean
    before_id: string
    count: number
}) => {
    return http.get('/api/post/comment-more',{
        params: data
    })
}

export const get_like_comment = (data : {comment_id: string}) => {
    return http.get(`/api/post/like-comment`,{
        params: data
    })
}

export const like_comment = (data : {comment_id: string}) => {
    return http.post(`/api/post/like-comment`,data)
}

export const get_more_post = (data : {
    type: string
    source: string
    before_id: string
    by : string
    count: number
}) => {
    return http.get('/api/post/post-more',{
        params: data
    })
}

export const get_page_post = (data : {
    type: string
    source: string
    page: number
    by : string
    count: number
    user_id: string
}) => {
    return http.get('/api/post/post-page',{
        params: data
    })
}

export const set_featured = (data : {post_id: string}) => {
    return http.post('/api/post/feature',data)
}

export const get_diary_list = (data : {user_id: string}) => {
    console.log(data)
    return http.get(`/api/post/diary-list`,{
        params: data
    })
}

export const search_post = (data : {
    keyword: string
    page: number
    count: number
}) => {
    return http.get('/api/post/search',{
        params: data
    })
}