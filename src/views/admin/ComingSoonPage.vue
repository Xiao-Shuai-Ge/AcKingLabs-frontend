<template>
  <Header />
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <div class="coming-soon-container">
        <div class="coming-soon-content">
          <div class="icon-wrapper">
            <el-icon size="80" color="#409EFF">
              <Clock />
            </el-icon>
          </div>
          
          <h1>功能开发中</h1>
          <p class="description">
            该功能正在紧张开发中，敬请期待！
          </p>
          
          <!-- <div class="features-preview">
            <h3>即将推出的功能：</h3>
            <ul>
              <li v-for="feature in upcomingFeatures" :key="feature">
                <el-icon><Check /></el-icon>
                {{ feature }}
              </li>
            </ul>
          </div>
          
          <div class="action-buttons">
            <el-button type="primary" @click="goBack">
              <el-icon><ArrowLeft /></el-icon>
              返回上一页
            </el-button>
            <el-button @click="goHome">
              <el-icon><House /></el-icon>
              回到首页
            </el-button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { Clock, Check, ArrowLeft, House } from '@element-plus/icons-vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import Header from '@/components/Header.vue'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

// 根据当前路由显示不同的即将推出功能
const upcomingFeatures = computed(() => {
  const path = route.path
  
  if (path.includes('/admin/posts')) {
    return [
      '内容发布管理',
      '文章审核流程',
      '内容分类管理',
      '评论管理',
      '内容统计分析'
    ]
  } else if (path.includes('/admin/settings')) {
    return [
      '系统参数配置',
      '用户权限管理',
      '系统日志查看',
      '数据备份恢复',
      '邮件模板管理'
    ]
  } else {
    return [
      '更多管理功能',
      '数据统计分析',
      '系统监控面板',
      '自动化任务管理'
    ]
  }
})

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 回到首页
const goHome = () => {
  router.push('/')
}
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

.coming-soon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.coming-soon-content {
  text-align: center;
  max-width: 600px;
  padding: 40px;
}

.icon-wrapper {
  margin-bottom: 30px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

h1 {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.description {
  font-size: 16px;
  color: #606266;
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.features-preview {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 30px;
  margin: 40px 0;
  text-align: left;
}

.features-preview h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
  text-align: center;
}

.features-preview ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-preview li {
  display: flex;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  color: #606266;
}

.features-preview li .el-icon {
  margin-right: 12px;
  color: #67C23A;
  font-size: 16px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 30px;
}

.action-buttons .el-button {
  padding: 12px 24px;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-content {
    margin-left: 0;
  }
  
  .coming-soon-content {
    padding: 20px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons .el-button {
    width: 200px;
  }
}
</style>
