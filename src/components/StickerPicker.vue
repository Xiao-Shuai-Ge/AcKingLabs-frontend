<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :show-close="false"
    width="580px"
    align-center
    append-to-body
    class="sticker-dialog-custom"
    :close-on-click-modal="true"
  >
    <div class="sticker-picker-container">
      <!-- Header Area -->
      <div class="sticker-header">
        <el-tabs v-model="activeCategory" class="sticker-tabs-top">
          <el-tab-pane
            v-for="category in displayCategories"
            :key="category.name"
            :label="category.name"
            :name="category.name"
          />
        </el-tabs>
        <div class="close-btn" @click="$emit('update:modelValue', false)">
          <i class="fas fa-times"></i>
        </div>
      </div>

      <!-- Content Area -->
      <div class="sticker-body">
        <div 
          v-if="currentStickerList.length > 0"
          class="sticker-grid"
        >
          <div 
            v-for="(url, index) in currentStickerList" 
            :key="index" 
            @click="handleSelect(url)"
            class="sticker-item"
          >
            <img :src="url" loading="lazy" :alt="activeCategory + '-' + index" />
          </div>
        </div>
        <div v-else class="empty-state">
          暂无表情
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { stickerCategories, StickerGroup } from '@/utils/stickers';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  stickerList: {
    type: Array as () => string[],
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

const activeCategory = ref(stickerCategories[0]?.name || '默认');

const displayCategories = computed<StickerGroup[]>(() => {
  if (stickerCategories.length > 0) {
    return stickerCategories;
  }
  
  if (props.stickerList.length > 0) {
    return [{
      name: '默认',
      list: props.stickerList
    }];
  }
  
  return [];
});

const currentStickerList = computed(() => {
  const category = displayCategories.value.find(c => c.name === activeCategory.value);
  return category ? category.list : [];
});

const handleSelect = (url: string) => {
  emit('select', url);
  emit('update:modelValue', false);
};
</script>

<style scoped>
/* Dialog Overlay Fixes */
:global(.sticker-dialog-custom) {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

:global(.sticker-dialog-custom .el-dialog__header) {
  display: none;
}

:global(.sticker-dialog-custom .el-dialog__body) {
  padding: 0;
}

.sticker-picker-container {
  display: flex;
  flex-direction: column;
  height: 480px;
  background-color: #fff;
}

.sticker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
  height: 56px;
  flex-shrink: 0;
}

.sticker-tabs-top {
  flex: 1;
}

.sticker-tabs-top :deep(.el-tabs__header) {
  margin: 0;
}

.sticker-tabs-top :deep(.el-tabs__nav-wrap::after) {
  display: none !important; /* Remove default gray underline */
}

.sticker-tabs-top :deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 500;
  color: #666;
  height: 56px;
  line-height: 56px;
}

.sticker-tabs-top :deep(.el-tabs__item.is-active) {
  color: #333; /* Darker text for active state */
  font-weight: 700;
  font-size: 16px;
}

.sticker-tabs-top :deep(.el-tabs__active-bar) {
  display: none !important; /* Hide the blue bar */
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
  margin-left: 16px;
}

.close-btn:hover {
  background-color: #f5f5f5;
  color: #666;
}

.sticker-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  background-color: #fafafa;
}

.sticker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

.sticker-item {
  cursor: pointer;
  border-radius: 12px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.sticker-item:hover {
  border-color: #40a9ff;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.12);
}

.sticker-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.2s;
}

.sticker-item:hover img {
  transform: scale(1.1);
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}
</style>
