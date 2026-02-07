<template>
  <Header />
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <div class="page-header">
        <h2>帖子审核</h2>
        <el-button type="primary" @click="fetchReviews">刷新列表</el-button>
      </div>
      
      <el-card class="box-card">
        <el-table :data="reviewList" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="审核ID" min-width="180" />
          <el-table-column prop="post_title" label="帖子标题" min-width="150" show-overflow-tooltip>
             <template #default="scope">
               <span class="cursor-pointer text-blue-500 hover:text-blue-700" @click="handlePreview(scope.row)">
                 {{ scope.row.post_title }}
               </span>
             </template>
          </el-table-column>
          <el-table-column prop="post_type" label="类型" width="100">
            <template #default="scope">
              <el-tag>{{ scope.row.post_type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="提交时间" width="180">
            <template #default="scope">
              {{ formatTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button 
                  type="primary" 
                  size="small" 
                  @click="handlePreview(scope.row)"
              >查看</el-button>
              <div v-if="scope.row.status === 0" class="inline-block ml-2">
                <el-button 
                  type="success" 
                  size="small" 
                  @click="handleAudit(scope.row, 1)"
                >通过</el-button>
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="handleAudit(scope.row, 2)"
                >拒绝</el-button>
              </div>
              <span v-else class="ml-2">已审核</span>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
    <el-dialog
      v-model="previewVisible"
      :title="previewTitle"
      width="70%"
      destroy-on-close
    >
      <div v-loading="previewLoading" class="min-h-[200px]">
        <div class="prose max-w-none">
          <v-md-preview :text="previewContent"></v-md-preview>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import { get_review_list, audit_review, get_post_detail } from '@/api/post'
import { ElMessage, ElMessageBox } from 'element-plus'

interface ReviewItem {
  id: string
  post_id: string
  reviewer_id: string
  status: number // 0: Pending, 1: Pass, 2: Reject
  reason: string
  create_time: number
  post_title: string
  post_type: string
  user_id: string
}

const loading = ref(false)
const reviewList = ref<ReviewItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const previewVisible = ref(false)
const previewLoading = ref(false)
const previewContent = ref('')
const previewTitle = ref('')

const fetchReviews = async () => {
  loading.value = true
  try {
    const res = await get_review_list({
      page: currentPage.value,
      count: pageSize.value
    })
    // @ts-ignore
    if (res.data.code === 20000) {
      // @ts-ignore
      reviewList.value = res.data.data.list || []
      // @ts-ignore
      total.value = res.data.data.total || 0
    } else {
      // @ts-ignore
      ElMessage.error(res.data.message || '获取审核列表失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handlePreview = async (row: ReviewItem) => {
  previewVisible.value = true
  previewLoading.value = true
  previewTitle.value = row.post_title
  try {
    const res = await get_post_detail({ id: row.post_id })
    // @ts-ignore
    if (res.data.code === 20000) {
      // @ts-ignore
      previewContent.value = res.data.data.content
    } else {
      // @ts-ignore
      ElMessage.error(res.data.message || '获取详情失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('网络错误')
  } finally {
    previewLoading.value = false
  }
}

const handleAudit = (row: ReviewItem, status: number) => {
  const actionText = status === 1 ? '通过' : '拒绝'
  ElMessageBox.confirm(
    `确定要${actionText}这篇帖子吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: status === 1 ? 'success' : 'warning',
    }
  ).then(async () => {
    try {
      const res = await audit_review({
        review_id: row.id,
        status: status
      })
      // @ts-ignore
      if (res.data.code === 20000) {
        ElMessage.success('操作成功')
        fetchReviews()
      } else {
        // @ts-ignore
        ElMessage.error(res.data.message || '操作失败')
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('网络错误')
    }
  })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchReviews()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchReviews()
}

const formatTime = (timestamp: number) => {
  if (!timestamp) return '-'
  return new Date(timestamp * 1000).toLocaleString()
}

const getStatusType = (status: number) => {
  switch (status) {
    case 0: return 'warning'
    case 1: return 'success'
    case 2: return 'danger'
    default: return 'info'
  }
}

const getStatusText = (status: number) => {
  switch (status) {
    case 0: return '待审核'
    case 1: return '已通过'
    case 2: return '已拒绝'
    default: return '未知'
  }
}

onMounted(() => {
  fetchReviews()
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  padding-top: 60px; /* Header height */
  min-height: 100vh;
  background-color: #f5f7fa;
}

.admin-content {
  margin-left: 200px; /* Sidebar width */
  padding: 20px;
  width: calc(100% - 200px);
  transition: margin-left 0.3s, width 0.3s;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
