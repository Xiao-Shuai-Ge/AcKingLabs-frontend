<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <Header/>
  <div
      class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4"
  >
    <div
        class="logo-container mb-5 transform transition-all duration-800 ease-out"
        :class="{ 'opacity-100': animationStarted, 'opacity-0': !animationStarted }"
    >
      <img :src="logoUrl" alt="实验室标志" class="w-big h-auto" />
    </div>

    <h1
        class="text-3xl md:text-4xl font-bold text-gray-800 mb-10 transform transition-all duration-800 ease-out"
        :class="{
        'opacity-100 translate-y-0': titleAnimationStarted,
        'opacity-0 translate-y-8': !titleAnimationStarted
      }"
    >
      AcKing 算法竞赛实验室
    </h1>

    <p
        class="text-lg md:text-xl text-gray-600 max-w-2xl text-center leading-relaxed transform transition-all duration-800 ease-out"
        :class="{
        'opacity-100 translate-y-0': textAnimationStarted,
        'opacity-0 translate-y-8': !textAnimationStarted
      }"
    >
      我们致力于为校内算法竞赛爱好者提供一个良好的学习交流环境
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Header from "@/components/Header.vue";

const animationStarted = ref(false);
const titleAnimationStarted = ref(false);
const textAnimationStarted = ref(false);

const logoUrl =
    "/assets/AcKing_black.png";

onMounted(() => {
  // 启动LOGO动画
  setTimeout(() => {
    animationStarted.value = true;

    // 启动标题动画，延迟300ms
    setTimeout(() => {
      titleAnimationStarted.value = true;

      // 启动文本动画，延迟600ms
      setTimeout(() => {
        textAnimationStarted.value = true;
      }, 600);
    }, 300);
  }, 100);
});

import {test} from '@/api/test';
import {test_token} from "@/api/auth";


//localStorage.setItem('atoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGFzcyI6ImF0b2tlbiIsImV4cCI6MTc0MzkzMzE3MiwidXNlcmlkIjoiMTkwODUyNDk2MDg1MTE2OTI4MCIsInVzZXJuYW1lIjoi5bCP5biF5ZOlIn0.9JS8Da5WsPHEo55digGti1aTHnkjEWCjXDqBXeWcQQM');
//localStorage.setItem('rtoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGFzcyI6InJ0b2tlbiIsImV4cCI6MTc0NDUzNzk1MiwidXNlcmlkIjoiMTkwODUyNDk2MDg1MTE2OTI4MCIsInVzZXJuYW1lIjoi5bCP5biF5ZOlIn0.PTM8qWAtz2dipvvRSXQy6cqeCuR7C669uhMyRqJyg8k');

const handleClick = async () => {
  console.log('Button clicked!');
  const data = await test();
  //const data = await test_token();
  console.log(data.data);
}
</script>

<style scoped>
.logo-container {
  transition: opacity 0.8s ease-out;
}

.w-big {
  max-width: 25rem;
}

h1,
p {
  transition:
      opacity 0.8s ease-out,
      transform 0.8s ease-out;
}
</style>
