<template>
  <div class="admin-sidebar">
    <el-menu
      :default-active="activeMenu"
      class="admin-menu"
      router
      :collapse="isCollapse"
    >
      <!-- <div class="admin-logo">
        <img src="/assets/AcKing_black.png" alt="AcKing" class="logo-img" />
        <span v-show="!isCollapse" class="logo-text">管理后台</span>
      </div> -->

      <el-menu-item index="/admin/users">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
      
      <el-menu-item index="/admin/posts">
        <el-icon><Document /></el-icon>
        <span>内容管理</span>
      </el-menu-item>
      
      <el-menu-item index="/admin/resumes">
        <el-icon><Trophy /></el-icon>
        <span>简历管理</span>
      </el-menu-item>
      
      <el-menu-item index="/admin/settings">
        <el-icon><Setting /></el-icon>
        <span>系统设置</span>
      </el-menu-item>
    </el-menu>
    
    <div class="sidebar-toggle" @click="toggleCollapse">
      <el-icon>
        <Expand v-if="isCollapse" />
        <Fold v-else />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  House, 
  User, 
  Document, 
  Trophy, 
  Setting, 
  Expand, 
  Fold 
} from '@element-plus/icons-vue'

const route = useRoute()
const isCollapse = ref(false)

// 当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
.admin-sidebar {
  position: fixed;
  left: 0;
  top: 60px;
  height: calc(100vh - 60px);
  width: 200px;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  transition: width 0.3s;
  z-index: 1000;
}

.admin-sidebar.collapsed {
  width: 64px;
}

.admin-menu {
  height: 100%;
  border-right: none;
}

.admin-logo {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.sidebar-toggle {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.sidebar-toggle:hover {
  background-color: #e4e7ed;
}

/* 折叠状态下的样式 */
.admin-sidebar.collapsed .admin-logo {
  justify-content: center;
  padding: 20px 0;
}

.admin-sidebar.collapsed .logo-text {
  display: none;
}

.admin-sidebar.collapsed .logo-img {
  margin-right: 0;
}
</style>
