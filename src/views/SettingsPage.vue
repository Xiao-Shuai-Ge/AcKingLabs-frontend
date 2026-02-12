<template>
  <div class="min-h-screen bg-white text-gray-900 flex flex-col items-center py-10 px-4">
    <Header />
    
    <div class="w-full max-w-4xl mt-10">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">个人设置</h1>
        <p class="text-gray-600">管理您的通知偏好设置</p>
      </div>

      <!-- 设置卡片 -->
      <div class="bg-white border-2 border-gray-800 rounded-lg shadow-lg p-6">
        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-800 border-t-transparent"></div>
        </div>

        <!-- 设置内容 -->
        <div v-else class="space-y-6">
          <!-- 通知设置标题 -->
          <div class="border-b-2 border-gray-200 pb-4">
            <h2 class="text-xl font-semibold text-gray-800 flex items-center">
              <i class="fas fa-bell mr-2"></i>
              通知设置
            </h2>
            <p class="text-sm text-gray-500 mt-1">选择您希望接收的通知类型</p>
          </div>

          <!-- 设置选项列表 -->
          <div class="space-y-4">
            <!-- 系统消息邮箱通知 -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div class="flex-1">
                <div class="flex items-center">
                  <i class="fas fa-envelope text-gray-600 mr-3"></i>
                  <div>
                    <h3 class="font-medium text-gray-900">系统消息邮箱通知</h3>
                    <p class="text-sm text-gray-500 mt-1">通过邮箱接收重要的系统消息通知</p>
                  </div>
                </div>
              </div>
              <el-switch
                v-model="settings.system_message_email_notify"
                size="large"
                :active-color="'#1f2937'"
                :inactive-color="'#d1d5db'"
                @change="handleSettingChange"
              />
            </div>

            <!-- 点赞通知 -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div class="flex-1">
                <div class="flex items-center">
                  <i class="fas fa-heart text-gray-600 mr-3"></i>
                  <div>
                    <h3 class="font-medium text-gray-900">点赞通知</h3>
                    <p class="text-sm text-gray-500 mt-1">当有人点赞您的内容时接收通知</p>
                  </div>
                </div>
              </div>
              <el-switch
                v-model="settings.like_notify"
                size="large"
                :active-color="'#1f2937'"
                :inactive-color="'#d1d5db'"
                @change="handleSettingChange"
              />
            </div>

            <!-- 回复通知 -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div class="flex-1">
                <div class="flex items-center">
                  <i class="fas fa-comment text-gray-600 mr-3"></i>
                  <div>
                    <h3 class="font-medium text-gray-900">回复通知</h3>
                    <p class="text-sm text-gray-500 mt-1">当有人回复您的帖子或评论时接收通知</p>
                  </div>
                </div>
              </div>
              <el-switch
                v-model="settings.reply_notify"
                size="large"
                :active-color="'#1f2937'"
                :inactive-color="'#d1d5db'"
                @change="handleSettingChange"
              />
            </div>

            <!-- 提及通知 -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div class="flex-1">
                <div class="flex items-center">
                  <i class="fas fa-at text-gray-600 mr-3"></i>
                  <div>
                    <h3 class="font-medium text-gray-900">提及通知</h3>
                    <p class="text-sm text-gray-500 mt-1">当有人在内容中提及您(@)时接收通知</p>
                  </div>
                </div>
              </div>
              <el-switch
                v-model="settings.mention_notify"
                size="large"
                :active-color="'#1f2937'"
                :inactive-color="'#d1d5db'"
                @change="handleSettingChange"
              />
            </div>

            <!-- 发布求助帖通知 -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div class="flex-1">
                <div class="flex items-center">
                  <i class="fas fa-question-circle text-gray-600 mr-3"></i>
                  <div>
                    <h3 class="font-medium text-gray-900">求助帖通知</h3>
                    <p class="text-sm text-gray-500 mt-1">当有新的求助帖发布时接收通知</p>
                  </div>
                </div>
              </div>
              <el-switch
                v-model="settings.help_post_notify"
                size="large"
                :active-color="'#1f2937'"
                :inactive-color="'#d1d5db'"
                @change="handleSettingChange"
              />
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-between items-center pt-6 border-t-2 border-gray-200">
            <el-button
              type="danger"
              plain
              @click="handleReset"
              :loading="resetting"
            >
              <i class="fas fa-undo mr-2"></i>
              恢复默认设置
            </el-button>

            <div class="flex gap-3">
              <el-button
                plain
                @click="handleCancel"
              >
                取消
              </el-button>
              <el-button
                type="primary"
                @click="handleSave"
                :loading="saving"
                :disabled="!hasChanges"
              >
                <i class="fas fa-save mr-2"></i>
                保存设置
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <div class="flex items-start">
          <i class="fas fa-info-circle text-blue-600 mt-1 mr-3"></i>
          <div class="text-sm text-blue-800">
            <p class="font-medium mb-1">温馨提示：</p>
            <ul class="list-disc list-inside space-y-1 text-blue-700">
              <li>关闭通知后，您仍然可以在消息中心查看所有通知</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import { get_setting, update_setting, reset_setting, SettingsJSON } from '@/api/user'
import { useMessage } from '@/store/message'
import { useUserStore } from '@/store/user'

const { addMessage } = useMessage()
const router = useRouter()
const userStore = useUserStore()

// 状态管理
const loading = ref(true)
const saving = ref(false)
const resetting = ref(false)

// 设置数据
const settings = ref<SettingsJSON>({
  system_message_email_notify: false,
  like_notify: false,
  reply_notify: false,
  mention_notify: true,
  help_post_notify: false
})

// 原始设置（用于检测是否有更改）
const originalSettings = ref<SettingsJSON>({
  system_message_email_notify: false,
  like_notify: false,
  reply_notify: false,
  mention_notify: true,
  help_post_notify: false
})

// 计算是否有更改
const hasChanges = computed(() => {
  return JSON.stringify(settings.value) !== JSON.stringify(originalSettings.value)
})

// 加载设置
const loadSettings = async () => {
  try {
    loading.value = true
    const response = await get_setting()
    
    if (response.data.code === 20000) {
      settings.value = { ...response.data.data.settings }
      originalSettings.value = { ...response.data.data.settings }
      addMessage('设置加载成功', 'success')
    } else {
      addMessage(response.data.message || '加载设置失败', 'error')
    }
  } catch (error) {
    console.error('加载设置失败:', error)
    addMessage('加载设置失败，请稍后重试', 'error')
  } finally {
    loading.value = false
  }
}

// 设置更改处理
const handleSettingChange = () => {
  // 开关切换时的即时反馈
  console.log('设置已更改:', settings.value)
}

// 保存设置
const handleSave = async () => {
  try {
    saving.value = true
    const response = await update_setting({ settings: settings.value })
    
    if (response.data.code === 20000) {
      originalSettings.value = { ...settings.value }
      addMessage('设置保存成功', 'success')
    } else {
      addMessage(response.data.message || '保存设置失败', 'error')
    }
  } catch (error) {
    console.error('保存设置失败:', error)
    addMessage('保存设置失败，请稍后重试', 'error')
  } finally {
    saving.value = false
  }
}

// 取消（返回上一页）
const handleCancel = () => {
  if (hasChanges.value) {
    if (confirm('您有未保存的更改，确定要离开吗？')) {
      router.back()
    }
  } else {
    router.back()
  }
}

// 恢复默认设置
const handleReset = async () => {
  if (!confirm('确定要恢复默认设置吗？此操作将重置所有通知偏好。')) {
    return
  }

  try {
    resetting.value = true
    const response = await reset_setting()
    
    if (response.data.code === 20000) {
      settings.value = { ...response.data.data.settings }
      originalSettings.value = { ...response.data.data.settings }
      addMessage('已恢复默认设置', 'success')
    } else {
      addMessage(response.data.message || '恢复默认设置失败', 'error')
    }
  } catch (error) {
    console.error('恢复默认设置失败:', error)
    addMessage('恢复默认设置失败，请稍后重试', 'error')
  } finally {
    resetting.value = false
  }
}

// 页面挂载时加载设置
onMounted(async () => {
  // 检查登录状态
  if (!userStore.isLogin()) {
    addMessage('请先登录', 'warning')
    router.push('/login')
    return
  }
  
  await loadSettings()
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-gray-50:hover {
  transition: all 0.2s ease-in-out;
}
</style>

