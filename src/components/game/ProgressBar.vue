<template>
  <div
      class="progress-container relative w-full overflow-hidden rounded-full"
      :style="{ height: `${height}px` }"
  >
    <div class="progress-background absolute top-0 left-0 w-full h-full bg-gray-600 z-[0] rounded-full"></div>
    <div
        class="progress-fast absolute top-0 left-0 h-full transition-all duration-300 ease-in-out z-[2] bg-gray-500  rounded-full"
        :style="{ width: `${validFastPercent}%` }"
    ></div>
    <div
        class="progress-main absolute top-0 left-0 h-full transition-all duration-300 ease-in-out z-[3] rounded-full"
        :class="color"
        :style="{
        width: `${mainPercent}%`,
      }"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 主进度条颜色
  color: {
    type: String,
    default: 'bg-green-500' // Vue 经典绿色
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
    validator: value => value >= 0 && value <= 100
  },
  // 进度条高度 (像素)
  height: {
    type: Number,
    default: 5
  }
})

// 确保快速进度不小于主进度
const validFastPercent = computed(() =>
    Math.max(props.fastPercent, props.mainPercent)
)
</script>