<template>
  <Header />
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <div class="content-header">
        <h1>简历管理</h1>
        <p>管理系统中的所有简历，包括查看、通过和删除简历</p>
      </div>
      
      <div class="content-body">
        <!-- 搜索和筛选区域 -->
        <div class="search-section">
          <div class="search-controls">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索姓名、学号或邮箱"
              style="width: 300px"
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            
            <el-select
              v-model="statusFilter"
              placeholder="筛选状态"
              style="width: 150px; margin-left: 10px"
              clearable
              @change="handleStatusFilter"
            >
              <el-option label="全部" value="" />
              <el-option label="未通过" value="0" />
              <el-option label="已通过" value="1" />
              <el-option label="已拒绝" value="-1" />
            </el-select>
            
            <el-button
              type="primary"
              :icon="Refresh"
              @click="refreshData"
              style="margin-left: 10px"
            >
              刷新
            </el-button>
          </div>
        </div>

        <!-- 简历列表表格 -->
        <div class="table-section">
          <el-table
            v-loading="loading"
            :data="filteredResumes"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            
            <el-table-column prop="id" label="ID" width="120" />
            
            <el-table-column label="照片" width="80">
              <template #default="{ row }">
                <div class="w-10 overflow-hidden border border-gray-300">
                  <img
                    :src="row.avatar || '/assets/default_avatar.png'"
                    :alt="row.real_name"
                    class="w-full h-full object-cover"
                  />
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="real_name" label="姓名" width="100" />
            
            <el-table-column prop="student_no" label="学号" width="120" />
            
            <el-table-column prop="email" label="邮箱" width="200" />
            
            <el-table-column prop="grade" label="年级" width="80">
              <template #default="{ row }">
                <span>{{ row.grade }}年级</span>
              </template>
            </el-table-column>
            
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column prop="created_at" label="投递时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.created_at) }}
              </template>
            </el-table-column>
            
            <el-table-column prop="updated_at" label="更新时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.updated_at) }}
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="350" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="small"
                  @click="viewResumeDetail(row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="row.status === 0"
                  type="success"
                  size="small"
                  @click="acceptResume(row)"
                >
                  通过
                </el-button>
                <el-button
                  v-if="row.status === 0"
                  type="warning"
                  size="small"
                  @click="rejectResume(row)"
                >
                  拒绝
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteResume(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="totalResumes"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 简历详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="简历详情"
      width="800px"
      @close="resetDetailForm"
    >
      <div v-if="currentResume" class="resume-detail">
        <div class="mb-4 flex items-center space-x-4">
          <div class="w-64 overflow-hidden border-2 border-gray-300">
            <img
              :src="currentResume.avatar || '/assets/default_avatar.png'"
              :alt="currentResume.real_name"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">{{ currentResume.real_name }}</h2>
            <p class="text-gray-600">{{ currentResume.email }}</p>
          </div>
        </div>
        
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">
            {{ currentResume.real_name }}
          </el-descriptions-item>
          <el-descriptions-item label="学号">
            {{ currentResume.student_no }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱">
            {{ currentResume.email }}
          </el-descriptions-item>
          <el-descriptions-item label="年级">
            {{ currentResume.grade }}年级
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(currentResume.status)">
              {{ getStatusText(currentResume.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="投递时间">
            {{ formatDate(currentResume.created_at) }}
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="resume-content" style="margin-top: 20px;">
          <div class="mb-4">
            <h1 class="text-lg font-bold bg-gray-50 border border-gray-200 p-2">个人介绍</h1>
            <p class="p-2 bg-white border border-gray-200">{{ currentResume.extra?.information || '未填写' }}</p>
          </div>

          <div class="mb-4">
            <h1 class="text-lg font-bold bg-gray-50 border border-gray-200 p-2">专业能力</h1>
            <p class="p-2 bg-white border border-gray-200">{{ currentResume.extra?.skills || '未填写' }}</p>
          </div>

          <div class="mb-4">
            <h1 class="text-lg font-bold bg-gray-50 border border-gray-200 p-2">加入理由</h1>
            <p class="p-2 bg-white border border-gray-200">{{ currentResume.extra?.reason || '未填写' }}</p>
          </div>

          <div class="mb-4">
            <h1 class="text-lg font-bold bg-gray-50 border border-gray-200 p-2">对竞赛的理解</h1>
            <p class="p-2 bg-white border border-gray-200">{{ currentResume.extra?.understanding || '未填写' }}</p>
          </div>

          <div class="mb-4">
            <h1 class="text-lg font-bold bg-gray-50 border border-gray-200 p-2">未来计划</h1>
            <p class="p-2 bg-white border border-gray-200">{{ currentResume.extra?.future_plan || '未填写' }}</p>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button
          v-if="currentResume && currentResume.status === 0"
          type="success"
          @click="acceptResumeFromDetail"
        >
          通过简历
        </el-button>
        <el-button
          v-if="currentResume && currentResume.status === 0"
          type="warning"
          @click="rejectResumeFromDetail"
        >
          拒绝简历
        </el-button>
      </template>
    </el-dialog>

    <!-- 通过简历确认对话框 -->
    <el-dialog
      v-model="acceptDialogVisible"
      title="通过简历"
      width="400px"
    >
      <p>确定要通过这份简历吗？通过后将生成邀请码。</p>
      
      <template #footer>
        <el-button @click="acceptDialogVisible = false">取消</el-button>
        <el-button type="success" @click="confirmAcceptResume">确定通过</el-button>
      </template>
    </el-dialog>

    <!-- 拒绝简历确认对话框 -->
    <el-dialog
      v-model="rejectDialogVisible"
      title="拒绝简历"
      width="400px"
    >
      <p>确定要拒绝这份简历吗？此操作不可撤销。</p>
      
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="warning" @click="confirmRejectResume">确定拒绝</el-button>
      </template>
    </el-dialog>

    <!-- 邀请码显示对话框 -->
    <el-dialog
      v-model="inviteCodeDialogVisible"
      title="邀请码"
      width="400px"
    >
      <div class="invite-code-content">
        <p>简历已通过！生成的邀请码为：</p>
        <div class="invite-code">
          <el-input
            v-model="generatedInviteCode"
            readonly
            style="font-size: 18px; font-weight: bold; text-align: center;"
          />
        </div>
        <p style="color: #909399; font-size: 12px; margin-top: 10px;">
          已发送到申请人邮箱，也可将此邀请码发送给申请人
        </p>
      </div>
      
      <template #footer>
        <el-button @click="inviteCodeDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="copyInviteCode">复制邀请码</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import { getResumeList, deleteResume as deleteResumeApi, acceptResume as acceptResumeApi, rejectResume as rejectResumeApi, getResumeDetail, getResumeDetailAdmin } from '@/api/resume'
import Header from '@/components/Header.vue'
import type { ResumeListItem, GetResumeDetailResp } from '@/api/resume'

// 简历数据类型定义
interface ResumeItem extends Omit<ResumeListItem, 'avatar'> {
  avatar?: string
  extra?: {
    information: string
    skills: string
    reason: string
    understanding: string
    future_plan: string
  }
}

// 响应式数据
const loading = ref(false)
const resumes = ref<ResumeItem[]>([])
const filteredResumes = ref<ResumeItem[]>([])
const selectedResumes = ref<ResumeItem[]>([])
const searchKeyword = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const totalResumes = ref(0)

// 对话框状态
const detailDialogVisible = ref(false)
const acceptDialogVisible = ref(false)
const rejectDialogVisible = ref(false)
const inviteCodeDialogVisible = ref(false)
const currentResume = ref<ResumeItem | null>(null)
const resumeToAccept = ref<ResumeItem | null>(null)
const resumeToReject = ref<ResumeItem | null>(null)
const generatedInviteCode = ref('')

// 计算属性 - 过滤后的简历列表
const computedFilteredResumes = computed(() => {
  let result = resumes.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(resume => 
      resume.real_name.toLowerCase().includes(keyword) ||
      resume.student_no.toLowerCase().includes(keyword) ||
      resume.email.toLowerCase().includes(keyword)
    )
  }

  // 状态筛选
  if (statusFilter.value !== '') {
    const status = parseInt(statusFilter.value)
    result = result.filter(resume => resume.status === status)
  }

  return result
})

// 更新过滤后的简历列表
const updateFilteredResumes = () => {
  filteredResumes.value = computedFilteredResumes.value
}

// 获取状态文本
const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '未通过'
    case 1:
      return '已通过'
    case -1:
      return '已拒绝'
    default:
      return '未知'
  }
}

// 获取状态标签类型
const getStatusTagType = (status: number) => {
  switch (status) {
    case 0:
      return 'warning'
    case 1:
      return 'success'
    case -1:
      return 'danger'
    default:
      return 'info'
  }
}

// 获取简历列表
const fetchResumes = async () => {
  try {
    loading.value = true
    const response = await getResumeList(currentPage.value, pageSize.value)
    
    if (response.data.code === 20000) {
      resumes.value = response.data.data.resumes
      totalResumes.value = response.data.data.total
      updateFilteredResumes()
    } else {
      ElMessage.error('获取简历列表失败')
    }
  } catch (error) {
    console.error('获取简历列表失败:', error)
    ElMessage.error('获取简历列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  updateFilteredResumes()
}

// 状态筛选处理
const handleStatusFilter = () => {
  updateFilteredResumes()
}

// 刷新数据
const refreshData = () => {
  fetchResumes()
}

// 表格选择变化
const handleSelectionChange = (selection: ResumeItem[]) => {
  selectedResumes.value = selection
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchResumes()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchResumes()
}

// 查看简历详情
const viewResumeDetail = async (resume: ResumeItem) => {
  try {
    loading.value = true
    const response = await getResumeDetailAdmin({
      id: resume.id, 
      email: resume.email, 
      code: "000000"
    })
    
    if (response.data.code === 20000) {
      currentResume.value = response.data.data
      detailDialogVisible.value = true
      ElMessage.success('已获取完整简历详情')
      console.log('简历详情:', currentResume.value)
    } else {
      ElMessage.error('获取简历详情失败')
    }
  } catch (error) {
    console.error('获取简历详情失败:', error)
    ElMessage.error('获取简历详情失败')
  } finally {
    loading.value = false
  }
}

// 重置详情表单
const resetDetailForm = () => {
  currentResume.value = null
}

// 通过简历
const acceptResume = (resume: ResumeItem) => {
  resumeToAccept.value = resume
  acceptDialogVisible.value = true
}

// 从详情页通过简历
const acceptResumeFromDetail = () => {
  if (currentResume.value) {
    resumeToAccept.value = currentResume.value
    acceptDialogVisible.value = true
  }
}

// 拒绝简历
const rejectResume = (resume: ResumeItem) => {
  resumeToReject.value = resume
  rejectDialogVisible.value = true
}

// 从详情页拒绝简历
const rejectResumeFromDetail = () => {
  if (currentResume.value) {
    resumeToReject.value = currentResume.value
    rejectDialogVisible.value = true
  }
}

// 确认通过简历
const confirmAcceptResume = async () => {
  if (!resumeToAccept.value) return
  
  try {
    const response = await acceptResumeApi(resumeToAccept.value.id)
    
    if (response.data.code === 20000) {
      generatedInviteCode.value = response.data.data.code
      inviteCodeDialogVisible.value = true
      acceptDialogVisible.value = false
      
      // 更新简历状态
      const resume = resumes.value.find(r => r.id === resumeToAccept.value!.id)
      if (resume) {
        resume.status = 1
        updateFilteredResumes()
      }
      
      ElMessage.success('简历已通过')
    } else {
      ElMessage.error('通过简历失败')
    }
  } catch (error) {
    console.error('通过简历失败:', error)
    ElMessage.error('通过简历失败')
  } finally {
    resumeToAccept.value = null
  }
}

// 确认拒绝简历
const confirmRejectResume = async () => {
  if (!resumeToReject.value) return
  
  try {
    const response = await rejectResumeApi(resumeToReject.value.id)
    
    if (response.data.code === 20000) {
      rejectDialogVisible.value = false
      
      // 更新简历状态
      const resume = resumes.value.find(r => r.id === resumeToReject.value!.id)
      if (resume) {
        resume.status = -1
        updateFilteredResumes()
      }
      
      // 如果当前查看的是被拒绝的简历，也要更新详情页的状态
      if (currentResume.value && currentResume.value.id === resumeToReject.value.id) {
        currentResume.value.status = -1
      }
      
      ElMessage.success('简历已拒绝')
    } else {
      ElMessage.error('拒绝简历失败')
    }
  } catch (error) {
    console.error('拒绝简历失败:', error)
    ElMessage.error('拒绝简历失败')
  } finally {
    resumeToReject.value = null
  }
}

// 复制邀请码
const copyInviteCode = async () => {
  try {
    await navigator.clipboard.writeText(generatedInviteCode.value)
    ElMessage.success('邀请码已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 删除简历
const deleteResume = async (resume: ResumeItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 "${resume.real_name}" 的简历吗？此操作不可撤销。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await deleteResumeApi(resume.id)
    
    if (response.data.code === 20000) {
      ElMessage.success('简历删除成功')
      fetchResumes()
    } else {
      ElMessage.error('删除简历失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除简历失败:', error)
      ElMessage.error('删除简历失败')
    }
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 组件挂载时获取数据
onMounted(() => {
  fetchResumes()
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
}

.admin-content {
  flex: 1;
  margin-left: 200px;
  padding: 20px;
  background-color: #f5f7fa;
}

.content-header {
  margin-bottom: 20px;
}

.content-header h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.content-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.content-body {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.search-controls {
  display: flex;
  align-items: center;
}

.table-section {
  margin-bottom: 20px;
}

.pagination-section {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.resume-detail {
  max-height: 600px;
  overflow-y: auto;
}

.resume-content .el-card {
  margin-bottom: 10px;
}

.resume-content .el-card :deep(.el-card__body) {
  padding: 15px;
}

.resume-content p {
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
}

.invite-code-content {
  text-align: center;
}

.invite-code {
  margin: 20px 0;
}

.invite-code .el-input :deep(.el-input__inner) {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px;
}
</style>
