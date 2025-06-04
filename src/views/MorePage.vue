<template>
  <Header/>
  <div
      class="min-h-screen flex flex-col items-center bg-gray-50 px-4 pt-32"
  >
    <div v-for="(page, index) in pages"
         :key="index"
         class="max-w-5xl w-full flex bg-white rounded-lg p-6 transition-all duration-1500 border border-gray-200 shadow-md hover:shadow-xl cursor-pointer"
         :class="{
           'opacity-100 translate-y-0': page.animationStarted,
           'opacity-0 translate-y-8': !page.animationStarted
         }"
         @click="navigateTo(page.path)"
    >
      <i :class="page.icon" class="text-6xl m-2 mr-5"></i>
      <div class="flex flex-col mt-2">
        <h2 class="text-3xl font-bold">{{ page.title }}</h2>
        <p class="text-gray-600">{{ page.description }}</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import router from "@/router";

const pages = ref([
  {
    icon: "fa-solid fa-user-group",
    title: "关于我们",
    description: "关于 AcKing 实验室的贡献成员",
    path: "/more/about",
    animationStarted: false,
  }
])

onMounted(() => {
  for (let i = 0; i < pages.value.length; i++) {
    setTimeout(() => {
      pages.value[i].animationStarted = true
      console.log(pages.value[i].animationStarted)
    },i*300+100)
  }
})

const navigateTo = (path: string) => {
  router.push(path)
}

</script>