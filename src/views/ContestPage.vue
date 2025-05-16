<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <div class="max-w-4xl mx-auto py-8 px-6 mt-14">
      <!-- 平台选择 -->
      <div class="p-2 space-x-2 rounded-lg">
        <button
            v-for="platform in platforms"
            :key="platform.id"
            @click="selectPlatform(platform.id)"
            :class="[
              'py-2 px-4 rounded-button whitespace-nowrap cursor-pointer transition-colors duration-200 rounded-lg',
              selectedPlatform === platform.id
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100'
            ]"
        >
          {{ platform.name }}
        </button>
      </div>
      <!-- 比赛列表 -->
      <div class="space-y-6 mt-5">
        <div
            v-for="contest in filteredContests"
            :key="contest.id"
            class="contest-card bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            @click="goToContestDetail(contest.url)"
        >
          <div class="p-6 flex justify-between items-center">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ contest.name }}
              </h3>
              <p class="text-gray-600 mb-2">
                {{ formatContestTime(contest.startTime, contest.endTime) }}
              </p>
              <div class="flex items-center">
                <span
                    :class="[
                    'text-sm font-medium px-3 py-1 rounded-full',
                    getStatusClass(contest.status)
                  ]"
                >
                  {{ getStatusText(contest.status) }}
                </span>
                <span class="ml-3 text-gray-600 text-sm"
                >{{ contest.platform }}</span
                >
              </div>
            </div>
            <img
                :src="logo(contest.platform)"
                :alt="contest.platform"
                class="object-contain h-32"
            >
          </div>

        </div>

        <!-- 无数据状态 -->
        <div v-if="filteredContests.length === 0" class="text-center py-16">
          <i class="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-500 text-lg">当前平台没有比赛信息</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import Header from "@/components/Header.vue";

// 平台数据
const platforms = [
  { id: "all", name: "全部平台" },
  { id: "codeforces", name: "Codeforces" },
  { id: "atcoder", name: "AtCoder" },
  { id: "nowcoder", name: "牛客网" },
  { id: "acking", name: "其他" }
];

const logo = (platform: string) => {
  if (platform == "Codeforces") {
    return "/assets/codeforces.png";
  } else if (platform == "AtCoder") {
    return "/assets/atcoder.png";
  } else if (platform == "Nowcoder") {
    return "/assets/nowcoder.png";
  } else {
    return "/assets/acking-contest.png";
  }
}

// 比赛状态类型
type ContestStatus = "upcoming" | "ongoing" | "ended";

// 比赛数据接口
interface Contest {
  id: string;
  name: string;
  platform: string;
  startTime: Date;
  endTime: Date;
  status: ContestStatus;
  url: string;
  solutionUrl?: string;
}

// 当前选中的平台
const selectedPlatform = ref("all");

// 模拟比赛数据
const contests = ref<Contest[]>([
  {
    id: "2",
    name: "Codeforces Round #870 (Div. 2)",
    platform: "Codeforces",
    startTime: new Date(2025, 4, 14, 20, 0),
    endTime: new Date(2025, 4, 14, 22, 0),
    status: "ended",
    url: "https://codeforces.com/contest/1826",
    solutionUrl: "https://codeforces.com/blog/entry/115462",
  },
  {
    id: "3",
    name: "AtCoder Beginner Contest 302",
    platform: "AtCoder",
    startTime: new Date(2025, 5, 16, 20, 0),
    endTime: new Date(2025, 5, 16, 22, 0),
    status: "ongoing",
    url: "https://atcoder.jp/contests/abc302",
  },
  {
    id: "4",
    name: "牛客周赛 Round 5",
    platform: "Nowcoder",
    startTime: new Date(2025, 5, 18, 19, 0),
    endTime: new Date(2025, 5, 18, 21, 0),
    status: "upcoming",
    url: "https://ac.nowcoder.com/acm/contest/46800",
  },
  {
    id: "5",
    name: "2025 AcKing&竞赛中心暑假周赛-第一周",
    platform: "AcKing",
    startTime: new Date(2025, 5, 19, 10, 30),
    endTime: new Date(2025, 5, 19, 12, 30),
    status: "upcoming",
    url: "https://leetcode.cn/contest/biweekly-contest-104/",
  },
]);

// 根据选中平台筛选比赛
const filteredContests = computed(() => {
  if (selectedPlatform.value === "all") {
    return contests.value;
  }
  return contests.value.filter(
      (contest) => contest.platform.toLowerCase() === selectedPlatform.value,
  );
});

// 选择平台
const selectPlatform = (platformId: string) => {
  selectedPlatform.value = platformId;
};

// 格式化比赛时间
const formatContestTime = (startTime: Date, endTime: Date) => {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return `${formatDate(startTime)} 至 ${formatDate(endTime)}`;
};

// 获取状态文本
const getStatusText = (status: ContestStatus) => {
  switch (status) {
    case "upcoming":
      return "未开始";
    case "ongoing":
      return "进行中";
    case "ended":
      return "已结束";
    default:
      return "";
  }
};

// 获取状态样式类
const getStatusClass = (status: ContestStatus) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    case "ongoing":
      return "bg-green-100 text-green-800";
    case "ended":
      return "bg-gray-100 text-gray-800";
    default:
      return "";
  }
};

// 跳转到比赛详情
const goToContestDetail = (url: string) => {
  window.open(url, "_blank");
};

</script>

<style scoped>
.contest-card:active {
  transform: translateY(1px);
}

/* 移除number input的箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
