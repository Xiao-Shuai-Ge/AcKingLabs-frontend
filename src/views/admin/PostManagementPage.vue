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
          <el-table-column prop="id" label="审核ID" width="100" />
          <el-table-column prop="post_title" label="帖子标题" min-width="150" show-overflow-tooltip />
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
              <div v-if="scope.row.status === 0">
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
              <span v-else>已审核</span>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import { get_review_list, audit_review } from '@/api/post'
import { ElMessage, ElMessageBox } from 'element-plus'

interface ReviewItem {
  id: number
  post_id: number
  reviewer_id: number
  status: number // 0: Pending, 1: Pass, 2: Reject
  reason: string
  create_time: number
  post_title: string
  post_type: string
  user_id: number
}

const loading = ref(false)
const reviewList = ref<ReviewItem[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchReviews = async () => {
  loading.value = true
  try {
    const res = await get_review_list({
      page: currentPage.value,
      count: pageSize.value
    })
    // @ts-ignore
    if (res.code === 200) {
      // @ts-ignore
      reviewList.value = res.data.list || []
      // @ts-ignore
      total.value = res.data.total || 0
    } else {
      // @ts-ignore
      ElMessage.error(res.msg || '获取审核列表失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    loading.value = false
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
      if (res.code === 200) {
        ElMessage.success('操作成功')
        fetchReviews()
      } else {
        // @ts-ignore
        ElMessage.error(res.msg || '操作失败')
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
