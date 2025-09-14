<template>
    <Header />
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <div class="content-header">
        <h1>用户管理</h1>
        <p>管理系统中的所有用户，包括查看、编辑和删除用户信息</p>
      </div>
      
      <div class="content-body">
        <!-- 用户列表表格 -->
        <div class="table-section">
          <el-table
            v-loading="loading"
            :data="filteredUsers"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <!-- <el-table-column type="selection" width="55" /> -->
            
            <el-table-column prop="id" label="ID" width="200" />
            
            <el-table-column label="头像" width="80">
              <template #default="{ row }">
                <el-avatar
                  :src="row.avatar || '/assets/default_avatar.png'"
                  :size="40"
                />
              </template>
            </el-table-column>
            
            <el-table-column prop="username" label="用户名" width="120" />
            
            <el-table-column prop="email" label="邮箱" width="200" />
            
            <el-table-column prop="real_name" label="真实姓名" width="120" />
            
            <el-table-column label="角色" width="100">
              <template #default="{ row }">
                <el-tag :type="row.role >= 3 ? 'danger' : 'primary'">
                  {{ GetRoleName(CheckLevel(row.xp,row.role)) }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column prop="grade" label="年级" width="80">
              <template #default="{ row }">
                <span v-if="row.grade">{{ row.grade }}年级</span>
                <span v-else class="text-gray-400">未设置</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="xp" label="经验值" width="100" />
            
            <el-table-column prop="created_at" label="注册时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.created_at) }}
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="small"
                  @click="editUser(row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteUser(row)"
                  :disabled="row.role >= 3"
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
            :total="totalUsers"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑用户信息"
      width="500px"
      @close="resetEditForm"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
      >
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="editForm.avatar" />
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        
        <el-form-item label="真实姓名" prop="real_name">
          <el-input v-model="editForm.real_name" />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role">
            <el-option label="普通用户" :value="0" />
            <el-option label="管理员" :value="1" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="年级" prop="grade">
          <el-input-number
              v-model="editForm.grade"
              :min="20"
              :max="99"
              controls-position="right"
              size="large"
              placeholder="请输入年级(例如:23)"
          />
        </el-form-item>
        
        <el-form-item label="经验值" prop="xp">
          <el-input-number v-model="editForm.xp" :min="0" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUserEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import { get_user_list, delete_user, set_profile, set_role } from '@/api/user'
import Header from '@/components/Header.vue'
import { GetRoleName, CheckLevel } from '@/utils/level'

// 用户数据类型定义
interface UserItem {
  id: string
  username: string
  email: string
  avatar: string
  xp: number
  grade: number
  real_name: string
  role: number
  created_at: string
}

// 响应式数据
const loading = ref(false)
const users = ref<UserItem[]>([])
const filteredUsers = ref<UserItem[]>([])
const selectedUsers = ref<UserItem[]>([])
const searchKeyword = ref('')
const roleFilter = ref('')
const gradeFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const totalUsers = ref(0)

// 编辑对话框
const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = reactive({
  avatar: '',
  id: '',
  username: '',
  email: '',
  real_name: '',
  role: 0,
  grade: 0,
  xp: 0
})

// 表单验证规则
const editRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 计算属性 - 过滤后的用户列表
const computedFilteredUsers = computed(() => {
  let result = users.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(user => 
      user.username.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      (user.real_name && user.real_name.toLowerCase().includes(keyword))
    )
  }

  // 角色筛选
  if (roleFilter.value !== '') {
    result = result.filter(user => user.role === Number(roleFilter.value))
  }

  // 年级筛选
  if (gradeFilter.value !== '') {
    result = result.filter(user => user.grade === Number(gradeFilter.value))
  }

  return result
})

// 更新过滤后的用户列表
const updateFilteredUsers = () => {
  filteredUsers.value = computedFilteredUsers.value
}

// 获取用户列表
const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await get_user_list({
      page: currentPage.value,
      count: pageSize.value
    })
    
    if (response.data.code === 20000) {
      users.value = response.data.data.users
      totalUsers.value = response.data.data.total
      updateFilteredUsers()
    } else {
      ElMessage.error('获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  updateFilteredUsers()
}

// 角色筛选处理
const handleRoleFilter = () => {
  updateFilteredUsers()
}

// 年级筛选处理
const handleGradeFilter = () => {
  updateFilteredUsers()
}

// 刷新数据
const refreshData = () => {
  fetchUsers()
}

// 表格选择变化
const handleSelectionChange = (selection: UserItem[]) => {
  selectedUsers.value = selection
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchUsers()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchUsers()
}

// 编辑用户
const editUser = (user: UserItem) => {
  Object.assign(editForm, {
    avatar: user.avatar,
    id: user.id,
    username: user.username,
    email: user.email,
    real_name: user.real_name,
    role: user.role,
    grade: user.grade,
    xp: user.xp
  })
  editDialogVisible.value = true
}

// 保存用户编辑
const saveUserEdit = async () => {
  try {
    await editFormRef.value.validate()
    
    // 更新用户资料
    await set_profile({
      avatar: editForm.avatar,
      id: editForm.id,
      username: editForm.username,
      real_name: editForm.real_name,
      grade: editForm.grade,
      student_no: '', // 保持原学号
      codeforces_id: '' // 保持原CF ID
    })
    
    // 更新用户角色
    await set_role({
      id: editForm.id,
      role: editForm.role
    })
    
    ElMessage.success('用户信息更新成功')
    editDialogVisible.value = false
    fetchUsers()
  } catch (error) {
    console.error('更新用户信息失败:', error)
    ElMessage.error('更新用户信息失败')
  }
}

// 重置编辑表单
const resetEditForm = () => {
  editFormRef.value?.resetFields()
}

// 删除用户
const deleteUser = async (user: UserItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.username}" 吗？此操作不可撤销。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await delete_user({ id: user.id })
    
    if (response.data.code === 20000) {
      ElMessage.success('用户删除成功')
      fetchUsers()
    } else {
      ElMessage.error('删除用户失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败')
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
  fetchUsers()
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

.table-section {
  margin-bottom: 20px;
}

.pagination-section {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.text-gray-400 {
  color: #c0c4cc;
}
</style>
