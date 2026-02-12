<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :show-close="false"
    width="500px"
    align-center
    append-to-body
    class="user-selector-dialog"
    :close-on-click-modal="true"
  >
    <div class="user-selector-container">
      <!-- Header / Search Area -->
      <div class="selector-header">
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input 
            ref="searchInput"
            v-model="searchKeyword" 
            placeholder="搜索用户..." 
            class="search-input"
            @input="handleSearch"
          />
        </div>
        <div class="close-btn" @click="$emit('update:modelValue', false)">
          <i class="fas fa-times"></i>
        </div>
      </div>

      <!-- Content Area -->
      <div class="selector-body" v-loading="loading">
        <div v-if="userList.length > 0" class="user-list">
          <div 
            v-for="user in userList" 
            :key="user.id" 
            class="user-item"
            @click="handleSelect(user)"
          >
            <img :src="user.avatar" alt="avatar" class="user-avatar" />
            <div class="user-info">
              <span class="user-name">{{ user.username }}</span>
              <span class="user-role-badge" :class="getRoleClass(user.role)">{{ getRoleName(user.role) }}</span>
            </div>
            <div class="user-xp">XP: {{ user.xp }}</div>
          </div>
        </div>
        
        <div v-else-if="searchKeyword && !loading" class="empty-state">
          未找到相关用户
        </div>
        
        <div v-else-if="!searchKeyword" class="empty-state">
          输入用户名进行搜索
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="total > 0" class="selector-footer">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="fetchUsers"
          small
        />
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue';
import { search_users } from '@/api/user';
import { debounce } from 'lodash-es';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

const searchKeyword = ref('');
const userList = ref<any[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(5);
const total = ref(0);
const searchInput = ref<HTMLInputElement | null>(null);

// Reset state when dialog opens
watch(() => props.modelValue, (val) => {
  if (val) {
    searchKeyword.value = '';
    userList.value = [];
    total.value = 0;
    currentPage.value = 1;
    fetchUsers(); // 打开时自动搜索
    nextTick(() => {
      searchInput.value?.focus();
    });
  }
});

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await search_users({
      page: currentPage.value,
      count: pageSize.value,
      keyword: searchKeyword.value
    });
    
    if (res.data.code === 20000) {
      userList.value = res.data.data.users;
      total.value = res.data.data.total;
    }
  } catch (error) {
    console.error('Failed to search users:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = debounce(() => {
  currentPage.value = 1;
  fetchUsers();
}, 300);

const handleSelect = (user: any) => {
  emit('select', user);
  emit('update:modelValue', false);
};

const getRoleName = (role: number) => {
  switch(role) {
    case 0: return '用户';
    case 1: return '用户';
    case 2: return '用户';
    case 3: return '管理';
    case 4: return '服主';
    default: return '未知';
  }
};

const getRoleClass = (role: number) => {
  if (role >= 4) return 'badge-super-admin';
  if (role === 3) return 'badge-admin';
  if (role === 2) return 'badge-pro';
  return 'badge-user';
};
</script>

<style scoped>
/* Dialog Overlay Fixes matching StickerPicker */
:global(.user-selector-dialog) {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

:global(.user-selector-dialog .el-dialog__header) {
  display: none;
}

:global(.user-selector-dialog .el-dialog__body) {
  padding: 0;
}

.user-selector-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  background-color: #fff;
}

.selector-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
  gap: 12px;
}

.search-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 20px;
  padding: 8px 16px;
  transition: all 0.2s;
}

.search-wrapper:focus-within {
  background-color: #fff;
  box-shadow: 0 0 0 2px #e6e8eb;
}

.search-icon {
  color: #909399;
  margin-right: 8px;
}

.search-input {
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  font-size: 14px;
  color: #333;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  color: #999;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #666;
}

.selector-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #fafafa;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #eee;
}

.user-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-color: #dcdfe6;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  border: 1px solid #eee;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.user-role-badge {
  display: inline-block;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  margin-top: 4px;
  align-self: flex-start;
}

.badge-super-admin { background-color: #fef0f0; color: #f56c6c; border: 1px solid #fde2e2; }
.badge-admin { background-color: #f0f9eb; color: #67c23a; border: 1px solid #e1f3d8; }
.badge-pro { background-color: #fdf6ec; color: #e6a23c; border: 1px solid #faecd8; }
.badge-user { background-color: #ecf5ff; color: #409eff; border: 1px solid #d9ecff; }

.user-xp {
  font-size: 12px;
  color: #909399;
  font-family: monospace;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
  font-size: 14px;
}

.selector-footer {
  padding: 10px 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: center;
  background-color: #fff;
}
</style>
