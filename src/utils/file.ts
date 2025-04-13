import {upload_image} from "@/api/file";
import {CodeHandler} from "@/store/message";

export const handleUploadImage = async (event,insertImage,files) => {
    try {
        for (let i in files) {
            // 1. 创建FormData对象
            const formData = new FormData();
            formData.append('file', files[i]);

            // 2. 调用你的上传接口（替换为你的实际接口地址）
            const data = await upload_image(formData)
            if (CodeHandler(data.data.code,[
                [20000, "上传成功","success"],
                [0, "上传失败","error"]]))
            {
                return
            }

            // 3. 插入图片到编辑器（假设接口返回url字段）
            insertImage({
                url: data.data.data.url,
                desc: '图片描述'
            });
        }
    } catch (error) {
        console.error('上传失败:', error);
        // 这里可以添加错误提示
    }
};