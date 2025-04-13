import http from "@/api/http";

export const upload_image = (formData: FormData) => {
    return http.post('/api/file/upload', formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}