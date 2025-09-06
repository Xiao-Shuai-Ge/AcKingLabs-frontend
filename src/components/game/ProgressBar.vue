<template>
  <div class="progress-container">
    <div class="progress-background"></div>
    <div
        class="progress-fast"
        :style="fastProgressStyle"
    ></div>
    <div
        class="progress-main"
        :style="mainProgressStyle"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 主进度条颜色
  color: {
    type: String,
    default: '#42b883' // 默认绿色
  },
  // 主进度百分比 (0-100)
  mainPercent: {
    type: Number,
    default: 0,
    validator: value => value >= 0 && value <= 100
  },
  // 快速进度百分比 (必须 >= 主进度)
  fastPercent: {
    type: Number,
    default: 0,
    validator: value => value >= 0 && value <= 100 && value >= props.mainPercent
  }
})

// 计算快速进度样式
const fastProgressStyle = computed(() => ({
  width: `${props.fastPercent}%`,
  backgroundColor: '#e0e0e0' // 浅灰色
}))

// 计算主进度样式
const mainProgressStyle = computed(() => ({
  width: `${props.mainPercent}%`,
  backgroundColor: props.color
}))
</script>

<style scoped>
.progress-container {
  position: relative;
  width: 100%;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
}

.progress-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #616161; /* 深灰色背景 */
  z-index: 0;
}

.progress-fast,
.progress-main {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transition: width 0.3s ease;
  z-index: 2;
}

.progress-main {
  z-index: 3; /* 主进度显示在最上层 */
}
</style>