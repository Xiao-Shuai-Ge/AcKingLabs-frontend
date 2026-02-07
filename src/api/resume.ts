import http from '@/api/http'

// 投递简历请求
export interface SubmitResumeReq {
  real_name: string
  grade: number
  student_no: string
  email: string
  avatar: string
  extra: {
    information: string
    skills: string
    reason: string
    understanding: string
    future_plan: string
  }
  code: string
}

// 投递简历响应
export interface SubmitResumeResp {
  id: string
}

// 修改简历请求
export interface UpdateResumeReq {
  id: string
  real_name: string
  grade: number
  student_no: string
  email: string
  avatar: string
  extra: {
    information: string
    skills: string
    reason: string
    understanding: string
    future_plan: string
  }
  code: string
}

// 修改简历响应
export interface UpdateResumeResp {
}

// 查询简历详细信息响应
export interface GetResumeDetailResp {
  id: string
  real_name: string
  grade: number
  student_no: string
  email: string
  avatar: string
  extra: {
    information: string
    skills: string
    reason: string
    understanding: string
    future_plan: string
  }
  code: string
  status: number // 0=未通过，1=已通过，-1=已拒绝，2=考核
  created_at: string
  updated_at: string
}

// 获取简历列表响应
export interface ResumeListItem {
  id: string
  real_name: string
  grade: number
  student_no: string
  email: string
  avatar: string
  status: number // 0=未通过，1=已通过，-1=已拒绝，2=考核
  created_at: string
  updated_at: string
}

export interface GetResumeListResp {
  resumes: ResumeListItem[]
  length: number
  page_total: number
  total: number
}

// 通过简历响应
export interface AcceptResumeResp {
  code: string
}

// 拒绝简历请求
export interface RejectResumeReq {
  id: string
}

// 挂起简历请求
export interface PendingResumeReq {
  id: string
}

// 挂起简历响应
export interface PendingResumeResp {
}

// 拒绝简历响应
export interface RejectResumeResp {
}

// 投递简历
export const submitResume = (data: SubmitResumeReq) => {
  return http.post('/api/resume/submit', data)
}

// 修改简历
export const updateResume = (data: UpdateResumeReq) => {
  return http.post('/api/resume/update', data)
}

// 查询简历详细信息
export const getResumeDetail = (data: {id: string,email: string, code: string}) => {
  return http.get('/api/resume/detail', {
    params: data
  })
}

export const getResumeDetailAdmin = (data: {id: string,email: string, code: string}) => {
  return http.get('/api/resume/detail-admin', {
    params: data
  })
}

// 获取简历列表（管理员功能）
export const getResumeList = (page: number, count: number, keyword?: string, status?: number) => {
  return http.get('/api/resume/list', {
    params: { page, count, keyword, status }
  })
}

// 删除简历（管理员功能）
export const deleteResume = (id: string) => {
  return http.post('/api/resume/delete',{ id })
}

// 通过简历（管理员功能）
export const acceptResume = (id: string) => {
  return http.post('/api/resume/accept', { id })
}

// 挂起简历（管理员功能）
export const pendingResume = (id: string) => {
  return http.post('/api/resume/pending', { id })
}

// 拒绝简历（管理员功能）
export const rejectResume = (id: string) => { 
  return http.post('/api/resume/reject', { id })
}

// 发送验证码（复用注册时的验证码接口）
export const sendCode = (email: string) => {
  return http.post('/api/login/send-code', { email })
}
