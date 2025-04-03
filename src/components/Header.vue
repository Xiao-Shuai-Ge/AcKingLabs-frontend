<template>
  <!-- 导航栏 -->
  <nav class="bg-white shadow-sm w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex-shrink-0 flex items-center">
          <img class="h-8 w-auto" src="/assets/AcKing_black.png" alt="公司Logo" />
          <span class="ml-2 text-xl font-semibold text-gray-900"
          >AcKing</span
          >
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-center space-x-4">
            <a
                href="#"
                class="text-gray-800 hover:text-black px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
            >首页</a
            >
            <a
                href="#"
                class="text-gray-800 hover:text-black px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
            >产品</a
            >
            <a
                href="#"
                class="text-gray-800 hover:text-black px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
            >服务</a
            >
            <a
                href="#"
                class="text-gray-800 hover:text-black px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
            >关于我们</a
            >
            <a
                href="#"
                class="text-gray-800 hover:text-black px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
            >联系我们</a
            >
          </div>
        </div>
        <div class="md:hidden">
          <button
              @click="toggleMobileMenu"
              class="text-gray-800 hover:text-black focus:outline-none cursor-pointer"
          >
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </div>
    <!-- 移动端菜单 -->
    <div v-if="isMobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a
            href="#"
            class="text-gray-800 hover:text-black block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
        >首页</a
        >
        <a
            href="#"
            class="text-gray-800 hover:text-black block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
        >产品</a
        >
        <a
            href="#"
            class="text-gray-800 hover:text-black block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
        >服务</a
        >
        <a
            href="#"
            class="text-gray-800 hover:text-black block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
        >关于我们</a
        >
        <a
            href="#"
            class="text-gray-800 hover:text-black block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
        >联系我们</a
        >
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 移动端菜单状态
const isMobileMenuOpen = ref(true);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>