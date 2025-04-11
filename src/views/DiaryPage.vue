<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
    <Header/>
    <!-- 头部发布按钮 -->
    <div class="mb-12 mt-10">
      <button
          class="w-32 h-32 rounded-full bg-black text-white border-2 border-black flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap hover:scale-105 transition-all duration-300 cursor-pointer"
          @click="navigateToPublish"
      >
        <i class="fas fa-plus text-xl"></i>
        <span class="ml-2">发布周记</span>
      </button>
    </div>

    <div class="text-gray-500 text-sm mb-4">
      <p>记录学习时间: {{ GetStudyTimeString(new Date(WeekDisplayTime)).formToFormat }}</p>
      <p>有效打卡时间: {{ GetValidSubmissionTime(new Date(WeekDisplayTime)).formToFormat }}</p>

    </div>

    <!-- 周期选择区域 -->
    <div class="w-full max-w-3xl flex items-center justify-between mb-8">
      <button
          class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap"
          @click="prevWeek"
      >
        <i class="fas fa-chevron-left text-gray-700"></i>
      </button>

      <h2 class="text-xl font-medium">{{ currentWeekDisplay }}</h2>

      <button
          class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap"
          @click="nextWeek"
      >
        <i class="fas fa-chevron-right text-gray-700"></i>
      </button>
    </div>

    <!-- 周记内容展示区 -->
    <div class="w-full max-w-3xl space-y-6">
      <!-- 排序方式选择 -->
      <div class="mb-6">
        <div class="flex gap-3">
          <button
              v-for="tab in SortTabs"
              :key="tab.id"
              @click="SelectTab = tab.id"
              :class="[
              'px-4 py-2 rounded-xl font-medium cursor-pointer whitespace-nowrap border-2 border-gray-800',
              SelectTab === tab.id ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>


      <div
          v-for="(post, index) in displayedPosts"
          :key="index"
          class="bg-white border-2 border-gray-300 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div class="flex items-center mb-2">
          <img
              :src="post.avatarUrl"
              :alt="`${post.username}的头像`"
              class="w-6 h-6 rounded-full object-cover object-top"
          />
          <div class="ml-3">
            <h3 class="font-medium text-base">{{ post.username }}</h3>
          </div>
        </div>

        <hr class="-mx-3 mb-2" />

        <p class="text-gray-800 mb-1 text-2xl whitespace-pre-line text-ellipsis line-clamp-1">
          {{ post.title }}
        </p>

        <p class="text-gray-500 mb-4 whitespace-pre-line text-ellipsis line-clamp-2">
          {{ post.content }}
        </p>

        <div class="flex items-center text-gray-500 text-sm">
          <div class="flex items-center mr-6">
            <i class="far fa-heart mr-1"></i>
            <span>{{ post.likes }}</span>
          </div>
          <div class="flex items-center">
            <i class="far fa-comment mr-1"></i>
            <span>{{ post.comments }}</span>
          </div>
          <div class="flex items-center ml-auto">
            <p class="text-sm text-gray-500">{{ post.publishDate }}</p>
          </div>
        </div>
      </div>

      <!-- 加载更多按钮 -->
      <div class="flex justify-center mt-8" v-if="hasMorePosts">
        <button
            class="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-300 flex items-center cursor-pointer !rounded-button whitespace-nowrap"
            @click="loadMorePosts"
            :disabled="isLoading"
        >
          <span v-if="!isLoading">加载更多</span>
          <i v-else class="fas fa-spinner fa-spin mr-2"></i>
          <span v-if="isLoading">加载中...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import Header from "@/components/Header.vue";
import {GetStudyTimeString, GetValidSubmissionTime, GetWeekCode, GetWeekday} from "@/utils/week";
import router from "@/router";

// 当前周期
const currentDate = ref(new Date("2025-04-09"));
const currentPage = ref(1);
const postsPerPage = 3;
const isLoading = ref(false);
const allPosts = ref<any[]>([]);
const displayedPosts = ref<any[]>([]);
const hasMorePosts = ref(true);

const WeekDisplayTime = ref(0);

onMounted(() => {
  // 将WeekDisplayTime时间调到这周周一,无论是周一几点都在周记提交时间范围内
  const date = new Date()
  WeekDisplayTime.value = date.getTime();
  const week = GetWeekday(date);
  if (week <= 2) {
    // 往回退
    WeekDisplayTime.value -= (week-1) * 24 * 60 * 60 * 1000;
  } else {
    // 往前推
    WeekDisplayTime.value += (8-week) * 24 * 60 * 60 * 1000;
  }
})

// 计算当前周显示
const currentWeekDisplay = computed(() => {
  return GetWeekCode(new Date(WeekDisplayTime.value)).name;
});

// 排序方式
const SortTabs = [
  { id: "popular", name: "推荐" },
  { id: "new", name: "最新" },
]
const SelectTab = ref("popular");


// 模拟获取周记数据
const fetchWeeklyPosts = (weekDate: Date, page: number) => {
  isLoading.value = true;

  // 模拟API请求延迟
  setTimeout(() => {
    const year = weekDate.getFullYear();
    const month = weekDate.getMonth() + 1;
    const day = weekDate.getDate();

    // 模拟数据生成
    const newPosts = [];
    const baseCount = ((month * day) % 10) + 5; // 基于日期生成随机数量

    for (
        let i = 0;
        i < (page === 1 ? baseCount : Math.floor(baseCount / 2));
        i++
    ) {
      newPosts.push({
        id: `post-${year}${month}${day}-${page}-${i}`,
        username: `用户${(i + 1) * page}`,
        avatarUrl: `https://readdy.ai/api/search-image?query=professional portrait photo of asian person, minimalist style, black and white photography, high quality, professional lighting, neutral expression&width=200&height=200&flag=e0bbd1f573dc0512ee5db91d8c06a642&seq=${i}${page}&orientation=squarish`,
        publishDate: `${year}-${month.toString().padStart(2, "0")}-${(day - (i % 7)).toString().padStart(2, "0")}`,
        content: generateRandomContent(i, page),
        title: `周记${(i + 1) * page}`,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
      });
    }

    if (page === 1) {
      allPosts.value = newPosts;
      displayedPosts.value = newPosts;
    } else {
      allPosts.value = [...allPosts.value, ...newPosts];
      displayedPosts.value = [...displayedPosts.value, ...newPosts];
    }

    // 模拟数据加载完毕
    hasMorePosts.value = page < 3; // 假设最多有3页数据
    isLoading.value = false;
  }, 800);
};

// 生成随机内容
const generateRandomContent = (index: number, page: number) => {
  const contents = [
    "本周完成了项目的核心功能开发，解决了几个关键性的技术难题。团队协作非常顺畅，下周计划开始进行全面测试。本周完成了项目的核心功能开发，解决了几个关键性的技术难题。团队协作非常顺畅，下周计划开始进行全面测试。本周完成了项目的核心功能开发，解决了几个关键性的技术难题。团队协作非常顺畅，下周计划开始进行全面测试。本周完成了项目的核心功能开发，解决了几个关键性的技术难题。团队协作非常顺畅，下周计划开始进行全面测试。",
    "这周主要在重构代码，提高了系统的稳定性和性能。同时也开始学习了新的技术栈，希望能在下个项目中应用。",
    "本周工作比较忙碌，处理了几个紧急的客户需求。虽然有些疲惫，但看到客户的满意反馈还是很有成就感的。下周需要调整一下节奏。",
    "这一周主要在进行需求分析和设计工作，与产品团队进行了多次沟通。计划在下周开始编码实现。希望一切顺利！",
    "本周参加了一个行业研讨会，收获颇丰。了解了很多前沿技术和发展趋势，对今后的工作有很大启发。",
    "这周完成了季度目标的80%，进度比预期要快。团队士气很高，大家都在积极贡献。希望下周能够圆满完成所有任务。",
    "本周遇到了一些技术挑战，花了不少时间研究解决方案。虽然进度有些延迟，但问题已经解决，下周可以加快速度了。",
  ];

  const randomIndex = (index + page) % contents.length;
  return contents[randomIndex];
};

// 周期切换
const prevWeek = () => {
  WeekDisplayTime.value -= 7 * 24 * 60 * 60 * 1000;
};

const nextWeek = () => {
  WeekDisplayTime.value += 7 * 24 * 60 * 60 * 1000;
};

// 加载更多
const loadMorePosts = () => {
  if (isLoading.value || !hasMorePosts.value) return;

  currentPage.value++;
  fetchWeeklyPosts(currentDate.value, currentPage.value);
};

// 跳转到发布页面
const navigateToPublish = () => {
  router.push('/diary/create');
};

// 初始化加载数据
onMounted(() => {
  fetchWeeklyPosts(currentDate.value, currentPage.value);
});
</script>

<style scoped>
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
