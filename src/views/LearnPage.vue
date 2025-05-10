<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <Header/>
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <!-- 筛选区域 -->
      <div class="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <!-- 帖子类型筛选 -->
        <div class="mb-4">
          <h3 class="text-sm font-medium text-gray-500 mb-3">帖子类型</h3>
          <div class="flex flex-wrap gap-2">
            <button
                v-for="type in postTypes"
                :key="type.id"
                @click="selectPostType(type.id)"
                :class="[
                'px-4 py-2 rounded-button text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap',
                selectedPostType === type.id ? 'bg-black text-white' : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
              ]"
            >
              {{ type.name }}
            </button>
          </div>
        </div>

        <!-- 排序方式筛选 -->
        <div>
          <h3 class="text-sm font-medium text-gray-500 mb-3">排序方式</h3>
          <div class="flex flex-wrap gap-2">
            <button
                v-for="sort in sortOptions"
                :key="sort.id"
                @click="selectSortOption(sort.id)"
                :class="[
                'px-4 py-2 rounded-button text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap',
                selectedSortOption === sort.id ? 'bg-black text-white' : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
              ]"
            >
              {{ sort.name }}
            </button>
          </div>
        </div>
      </div>

      <div
          v-for="(post, index) in Posts"
          :key="index"
          class=" border-2 border-gray-500 rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
          @click="navigateToPost(post.ID)"
      >
        <div class="flex items-center mb-2">
          <img
              :src="post.AuthorAvatar"
              :alt="`${post.AuthorName}的头像`"
              class="w-6 h-6 rounded-full object-cover object-top border-2 border-gray-800"
          />
          <div class="ml-2">
            <h3 class="font-bold text-base" :class="GetTextColor(post.AuthorLevel)">{{ post.AuthorName }}</h3>
          </div>
        </div>

        <div class="mt-2 mb-2 flex items-center gap-2">
          <span class="text-2xl font-bold"> {{ post.Title }} </span>
          <span class="text-gray-500 border-2 border-gray-500 rounded-md px-1 text-sm"> {{post.TypeName}} </span>
          <span v-if="post.IsPrivate" class="text-blue-500 border-2 border-blue-500 rounded-md px-1 text-sm">私密</span>
          <span v-if="post.IsFeatured" class="text-yellow-500 border-2 border-yellow-500 rounded-md px-1 text-sm">精华</span>
          <span v-if="post.IsAdminLike" class="text-red-500 border-2 border-red-500 rounded-md px-1 text-sm">管理推荐</span>
        </div>

        <p class="text-gray-400 mb-4 whitespace-pre-line text-ellipsis line-clamp-1 text-sm">
          {{ post.Content }}
        </p>

        <div class="flex items-center text-gray-500 text-sm">
          <div class="flex items-center mr-6">
            <i class="far fa-heart mr-1"
               :class="{
                'text-red-500 fas': post.IsLiked,
                'text-gary-500 far': !post.IsLiked
              }"
            ></i>
            <span>{{ post.Likes }}</span>
          </div>
          <div class="flex items-center">
            <i class="far fa-comment mr-1"></i>
            <span>{{ post.Comments }}</span>
          </div>
          <div class="flex items-center ml-auto">
            <p class="text-sm text-gray-500">{{ post.PublishDate }}</p>
          </div>
        </div>
      </div>

      <!-- 分页器 -->
      <div class="flex justify-center items-center space-x-2">
        <button
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-button border border-gray-300 text-sm cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-angle-double-left"></i>
        </button>
        <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-button border border-gray-300 text-sm cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-angle-left"></i>
        </button>

        <template v-for="page in displayedPages" :key="page">
          <button
              v-if="page !== '...'"
              @click="goToPage(page)"
              :class="[
              'px-3 py-1 rounded-button text-sm cursor-pointer whitespace-nowrap',
              currentPage === page
                ? 'bg-black text-white'
                : 'border border-gray-300 hover:bg-gray-100'
            ]"
          >
            {{ page }}
          </button>
          <span v-else class="px-2">...</span>
        </template>

        <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-button border border-gray-300 text-sm cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-angle-right"></i>
        </button>
        <button
            @click="goToPage(totalPages)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-button border border-gray-300 text-sm cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-angle-double-right"></i>
        </button>
      </div>
    </div>
    <div class="floating-component">
      <div
          class="bg-blue-400 rounded-md shadow-lg p-4 duration-300 hover:scale-105 hover:bg-blue-500 cursor-pointer"
          @click="navigateTo('/learn/create')"
      >
        <i class="fas fa-add text-white text-2xl w-6 h-5"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import Header from "@/components/Header.vue";
import router from "@/router";
import {GetTextColor} from "@/utils/level";

// 帖子类型
const postTypes = [
  { id: "all", name: "全部" },
  { id: "tutorial", name: "教程" },
  { id: "solution", name: "题解" },
  { id: "chat", name: "闲聊" },
];

// 排序选项
const sortOptions = [
  { id: "hot", name: "热度" },
  { id: "time", name: "时间" },
  { id: "featured", name: "精华" },
];

// 当前选中的筛选条件
const selectedPostType = ref("all");
const selectedSortOption = ref("hot");

// 分页相关
const currentPage = ref(1);
const postsPerPage = 5;
const totalPages = 6;

// 选择帖子类型
const selectPostType = (typeId: string) => {
  selectedPostType.value = typeId;
  currentPage.value = 1; // 重置到第一页
};

// 选择排序方式
const selectSortOption = (sortId: string) => {
  selectedSortOption.value = sortId;
  currentPage.value = 1; // 重置到第一页
};

// 跳转到指定页
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages) {
    currentPage.value = page;
  }
};

// 获取类型名称
const getTypeName = (typeId: string) => {
  const type = postTypes.find((t) => t.id === typeId);
  return type ? type.name : "";
};

// 获取类型样式
const getTypeClass = (typeId: string) => {
  switch (typeId) {
    case "tutorial":
      return "bg-blue-100 text-blue-800";
    case "solution":
      return "bg-green-100 text-green-800";
    case "chat":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// 计算要显示的页码
const displayedPages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    // 如果总页数小于等于最大可见页数，显示所有页码
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // 总是显示第一页
    pages.push(1);

    // 计算中间页码的起始和结束
    let startPage = Math.max(2, currentPage.value - 1);
    let endPage = Math.min(totalPages - 1, currentPage.value + 1);

    // 调整以确保显示3个中间页码
    if (startPage === 2) {
      endPage = Math.min(4, totalPages - 1);
    }
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, totalPages - 3);
    }

    // 添加省略号
    if (startPage > 2) {
      pages.push("...");
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 添加省略号
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // 总是显示最后一页
    pages.push(totalPages);
  }

  return pages;
});

// 模拟帖子数据
const posts = [
  {
    id: 1,
    title: "如何高效学习前端开发技术",
    author: "技术大咖",
    date: "2025-05-08",
    views: 1258,
    type: "tutorial",
    content:
        "前端开发是一个不断变化的领域，要想高效学习，首先需要掌握 HTML、CSS 和 JavaScript 的基础知识。然后逐步学习框架如 Vue、React 等。本文将分享一套完整的学习路径和方法，帮助你在短时间内掌握前端开发技能。学习过程中，实践很重要，建议边学边做项目...",
    tags: ["前端", "HTML", "CSS", "JavaScript"],
  },
  {
    id: 2,
    title: "LeetCode 第 217 题解析：存在重复元素",
    author: "算法爱好者",
    date: "2025-05-07",
    views: 856,
    type: "solution",
    content:
        "这道题目要求判断数组中是否存在重复元素，可以使用哈希表来解决。遍历数组，将每个元素加入哈希表，如果发现当前元素已经在哈希表中存在，则返回 true。时间复杂度为 O(n)，空间复杂度为 O(n)。以下是详细的代码实现和分析...",
    tags: ["算法", "LeetCode", "哈希表"],
  },
  {
    id: 3,
    title: "程序员的日常：那些年我们写过的 Bug",
    author: "代码人生",
    date: "2025-05-06",
    views: 2103,
    type: "chat",
    content:
        '作为一名程序员，Bug 是我们日常工作中不可避免的"朋友"。还记得那次我在生产环境中不小心删除了整个数据库，幸好有备份才避免了灾难。或者那次因为一个分号导致的无限循环，让服务器差点崩溃。这篇文章分享一些有趣的 Bug 故事，以及如何避免类似问题...',
    tags: ["程序员", "职场", "趣事"],
  },
  {
    id: 4,
    title: "Vue3 组合式 API 完全指南",
    author: "前端专家",
    date: "2025-05-05",
    views: 1876,
    type: "tutorial",
    content:
        "Vue3 的组合式 API 是一个革命性的特性，它让代码组织更加灵活。本文将详细介绍 ref、reactive、computed、watch 等核心 API 的使用方法和最佳实践。通过实际案例，展示如何将逻辑代码按功能而非选项组织，提高代码的可维护性和复用性...",
    tags: ["Vue3", "前端框架", "组合式API"],
  },
  {
    id: 5,
    title: "动态规划解决背包问题详解",
    author: "算法大师",
    date: "2025-05-04",
    views: 1432,
    type: "solution",
    content:
        "背包问题是算法面试中的经典问题。本文将从零开始，详细讲解如何使用动态规划解决 0-1 背包问题、完全背包问题等变种。包括状态定义、转移方程推导、代码实现以及优化技巧。通过图解和示例，帮助你彻底理解这一重要的算法思想...",
    tags: ["算法", "动态规划", "背包问题"],
  },
  {
    id: 6,
    title: "程序员健康指南：如何在久坐工作中保持身体健康",
    author: "健康码农",
    date: "2025-05-03",
    views: 2541,
    type: "chat",
    content:
        "长时间久坐编程对身体健康有很大影响。本文分享一些实用的健康建议，包括正确的坐姿、定时休息技巧、简单的办公室锻炼方法、护眼技巧等。通过这些小习惯，可以有效减轻颈椎和腰椎压力，预防职业病，保持良好的身体状态...",
    tags: ["健康", "程序员生活", "工作习惯"],
  },
  {
    id: 7,
    title: "TypeScript 高级类型系统详解",
    author: "TS专家",
    date: "2025-05-02",
    views: 1687,
    type: "tutorial",
    content:
        "TypeScript 的类型系统非常强大，本文将深入探讨泛型、条件类型、映射类型、索引类型等高级特性。通过实际例子，展示如何利用这些特性构建类型安全的应用程序。还将介绍一些常见的类型技巧和模式，帮助你更好地利用 TypeScript 的类型系统...",
    tags: ["TypeScript", "前端", "类型系统"],
  },
  {
    id: 8,
    title: "二叉树遍历算法全解析",
    author: "数据结构爱好者",
    date: "2025-05-01",
    views: 1243,
    type: "solution",
    content:
        "二叉树是最常见的数据结构之一，本文详细介绍前序、中序、后序和层序四种遍历方式的递归和非递归实现。分析每种方法的时间复杂度和空间复杂度，并讨论实际应用场景。通过图解和代码示例，帮助读者深入理解二叉树遍历算法的核心思想...",
    tags: ["算法", "二叉树", "数据结构"],
  },
  {
    id: 9,
    title: "从初级到高级：我的程序员成长之路",
    author: "十年码农",
    date: "2025-04-30",
    views: 3102,
    type: "chat",
    content:
        "回顾我从初级程序员成长为高级工程师的十年历程，分享其中的经验教训、技能积累和心态转变。讨论技术学习方法、项目管理技巧、团队协作经验以及职业规划建议。希望这些真实经历能给刚入行的程序员一些启发和指导...",
    tags: ["职业成长", "经验分享", "程序员"],
  },
  {
    id: 10,
    title: "React Hooks 最佳实践与常见陷阱",
    author: "React专家",
    date: "2025-04-29",
    views: 2056,
    type: "tutorial",
    content:
        "React Hooks 改变了组件的编写方式，但也带来了一些常见问题。本文总结 useState、useEffect、useCallback 等常用 Hooks 的最佳实践，以及依赖数组、闭包陷阱等常见问题的解决方案。通过实际案例，帮助你写出更清晰、高效的 React 组件...",
    tags: ["React", "Hooks", "前端"],
  },
];

// 根据筛选条件过滤帖子
const filteredPosts = computed(() => {
  let result = [...posts];

  // 按类型筛选
  if (selectedPostType.value !== "all") {
    result = result.filter((post) => post.type === selectedPostType.value);
  }

  // 按排序方式排序
  if (selectedSortOption.value === "hot") {
    result.sort((a, b) => b.views - a.views);
  } else if (selectedSortOption.value === "time") {
    result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } else if (selectedSortOption.value === "featured") {
    // 假设精华帖是浏览量超过2000的帖子
    const featured = result.filter((post) => post.views > 2000);
    const normal = result.filter((post) => post.views <= 2000);
    result = [...featured, ...normal];
  }

  return result;
});

const navigateTo = (url : string) => {
  router.push(url);
};
</script>

<style scoped>
/* 防止数字输入框的上下箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* 多行文本截断 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


.floating-component {
  position: fixed; /* 固定位置 */
  bottom: 5%; /* 下边距 */
  right: 5%; /* 右边距 */
  z-index: 10000; /* 设置 z-index 确保悬浮在顶层 */
}
</style>
