<template>
  <Message/>
  <router-view></router-view>
</template>

<script setup lang="ts">
import Message from "@/components/Message.vue";

// 黑夜模式切换，暂时废弃

import { useDark, useToggle } from '@vueuse/core'
import {useRoute} from "vue-router";
import {watch} from "vue";

const isDark = useDark()
const toggleDark = () => useToggle(isDark)
const route = useRoute()

// 定义需要暗黑模式的路由路径
const darkModeRoutes = ['/more/game'] // 替换为你的实际路由

// 监听路由变化
watch(() => route.path, (newPath) => {
  // 如果当前路由需要暗黑模式
  console.log("路由变化",newPath)
  if (darkModeRoutes.includes(newPath)) {
    isDark.value = true // 如果当前是白天则切换黑夜
  }
  // 其他路由使用白天模式
  else {
    isDark.value = false // 如果当前是黑夜则切换白天
  }
}, { immediate: false }) // 初始化时立即执行


</script>