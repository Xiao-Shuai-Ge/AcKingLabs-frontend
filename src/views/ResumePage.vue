<template>
  <Header />
  <div class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          {{ isEditMode ? '修改简历' : '投递简历' }}
        </h1>
        <p class="text-gray-600">
          {{ isEditMode ? '修改您的简历信息' : '加入 AcKing 实验室，开启您的竞赛之路' }}
        </p>
      </div>

      <!-- 获取已投递简历按钮 -->
      <div v-if="!isEditMode && formData.code" class="mb-6 text-center">
        <button
          @click="fetchExistingResume"
          :disabled="loading"
          class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {{ loading ? '查询中...' : '查询已投递简历' }}
        </button>
      </div>

      <!-- 简历表单 -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- 基本信息 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              邮箱 <span class="text-red-500">*</span>
            </label>
            <div class="flex space-x-2">
              <input
                v-model="formData.email"
                type="email"
                required
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入邮箱"
              />
            </div>
          </div>
          <!-- 验证码 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              邮箱验证码 <span class="text-red-500">*</span>
            </label>
            <div class="flex space-x-2">
              <input
                v-model="formData.code"
                type="text"
                required
                maxlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入6位验证码"
              />
              <button
                type="button"
                @click="sendVerificationCode"
                :disabled="codeSent || loading"
                class="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-md transition-colors whitespace-nowrap"
              >
                {{ codeSent ? '已发送' : '获取验证码' }}
              </button>
            </div>
            
          </div>

          <hr class="my-4"></hr>
         
          <!-- 头像上传 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              本人照片
            </label>
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-20 overflow-hidden border-2 border-gray-300">
                <img
                  :src="formData.avatar || '/assets/default_avatar.png'"
                  alt="照片预览"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1">
                <input
                  v-model="formData.avatar"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入图片URL或点击上传"
                />
                <!-- <p class="text-xs text-gray-500 mt-1">
                  支持第三方图床链接，如: https://imgurl.org
                </p> -->
              </div>
              <button
                type="button"
                @click="triggerFileUpload"
                class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                上传图片
              </button>
              <input
                type="file"
                ref="fileInput"
                class="hidden"
                accept="image/*"
                @change="handleFileUpload"
              />
            </div>
          </div>



          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                真实姓名 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.real_name"
                type="text"
                required
                minlength="2"
                maxlength="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入真实姓名"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                年级 <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="formData.grade"
                type="number"
                required
                min="0"
                max="99"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入年级"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                学号 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.student_no"
                type="text"
                required
                maxlength="30"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入学号"
              />
            </div>

          </div>

          

          <!-- 详细信息 -->
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                个人介绍 <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formData.extra.information"
                required
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请简单介绍一下自己，包括学习经历、兴趣爱好等"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                专业能力 <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formData.extra.skills"
                required
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请描述您的编程能力、算法基础、项目经验等"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                为什么要加入实验室 <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formData.extra.reason"
                required
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请说明您加入 AcKing 实验室的原因和期望"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                对竞赛的理解 <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formData.extra.understanding"
                required
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请谈谈您对算法竞赛的理解和看法"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                未来计划 <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="formData.extra.future_plan"
                required
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请描述您未来的学习和发展计划（详细到每学期以及毕业后的规划）"
              ></textarea>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="text-center pt-6">
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              {{ loading ? '提交中...' : (isEditMode ? '更新简历' : '投递简历') }}
            </button>
          </div>
        </form>
      </div>

      <!-- 成功提示 -->
      <div v-if="showSuccess" class="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        {{ successMessage }}
      </div>

      <!-- 错误提示 -->
      <div v-if="showError" class="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import { 
  submitResume, 
  updateResume, 
  getResumeDetail, 
  sendCode,
  type SubmitResumeReq,
  type UpdateResumeReq,
  type GetResumeDetailResp
} from '@/api/resume'
import { upload_image } from '@/api/file'
import { useMessage } from '@/store/message'
const { addMessage } = useMessage()

const router = useRouter()

// 响应式数据
const loading = ref(false)
const codeSent = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const resumeId = ref('0') // 初始为0，如果获取到已投递简历则更新为实际ID
const fileInput = ref<HTMLInputElement | null>(null)

// 表单数据
const formData = reactive({
  real_name: '',
  grade: 25,
  student_no: '',
  email: '',
  avatar: '',
  code: '',
  extra: {
    information: '',
    skills: '',
    reason: '',
    understanding: '',
    future_plan: ''
  }
})

// 计算属性
const isEditMode = computed(() => resumeId.value !== '0')
const isFormValid = computed(() => {
  return formData.real_name.length >= 2 &&
         formData.grade > 0 &&
         formData.student_no.length > 0 &&
         formData.email.includes('@') &&
         formData.code.length === 6 &&
         formData.extra.information.length > 0 &&
         formData.extra.skills.length > 0 &&
         formData.extra.reason.length > 0 &&
         formData.extra.understanding.length > 0 &&
         formData.extra.future_plan.length > 0
})

// 触发文件选择
const triggerFileUpload = () => {
  fileInput.value?.click()
}

// 处理文件上传
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 验证文件类型和大小（限制5MB）
  if (!file.type.startsWith('image/')) {
    addMessage('只能上传图片文件', 'error')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    addMessage('文件大小不能超过5MB', 'error')
    return
  }

  try {
    addMessage('上传中...', 'info')
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    const response = await upload_image(uploadFormData)

    if (response.data.code === 20000) {
      formData.avatar = response.data.data.url
      addMessage('上传成功', 'success')
    }
  } catch (error) {
    addMessage('上传失败，请稍后重试', 'error')
    console.error('Upload error:', error)
  } finally {
    // 清空文件输入
    if (target) {
      target.value = ''
    }
  }
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!formData.email) {
    addMessage('请先输入邮箱地址', 'error')
    return
  }

  try {
    loading.value = true
    await sendCode(formData.email)
    codeSent.value = true
    addMessage('验证码已发送到您的邮箱，请查收', 'success')
    
    // 60秒后可以重新发送
    setTimeout(() => {
      codeSent.value = false
    }, 60000)
  } catch (error: any) {
    addMessage(error.response?.data?.message || '发送验证码失败', 'error')
  } finally {
    loading.value = false
  }
}

// 查询已投递简历
const fetchExistingResume = async () => {
  if (!formData.email) {
    addMessage('请先输入邮箱地址', 'error')
    return
  }

  if (!formData.code) {
    addMessage('请先输入验证码', 'error')
    return
  }

  loading.value = true

  const response = await getResumeDetail({id: resumeId.value, email: formData.email, code: formData.code})

  if (response.data.code === 20000) {
    resumeId.value = response.data.data.id
    formData.real_name = response.data.data.real_name
    formData.grade = response.data.data.grade
    formData.student_no = response.data.data.student_no
    formData.email = response.data.data.email
    formData.avatar = response.data.data.avatar || ''
    formData.extra = response.data.data.extra
    addMessage('已获取到您的简历信息，可以修改后重新提交', 'success')
  } else {
    addMessage(response.data.message || '未获取到您有投递的简历', 'error')
  }
  loading.value = false
}

// 提交表单
const submitForm = async () => {
  if (!isFormValid.value) {
    addMessage('请填写完整的表单信息', 'error')
    return
  }


  loading.value = true

  let response;
  try {
    if (isEditMode.value) {
      // 更新简历
      const updateData: UpdateResumeReq = {
        id: resumeId.value,
        ...formData
      }
      response = await updateResume(updateData)
    } else {
      // 投递新简历
      const submitData: SubmitResumeReq = {
        ...formData
      }
      response = await submitResume(submitData)
      //resumeId.value = response.data.data.id
    }

    if (response.data.code === 20000) {
      addMessage('简历投递成功！', 'success')
    } else {
      addMessage(response.data.message || '操作失败', 'error')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 自定义样式 */
</style>
