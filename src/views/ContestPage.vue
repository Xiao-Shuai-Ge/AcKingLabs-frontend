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
            v-for="contest in contests"
            :key="contest.id"
            class="contest-card bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            @click="goToContestDetail(contest.url)"
        >
          <div class="p-4 flex justify-between items-center">
            <img
                :src="logo(contest.platform)"
                :alt="contest.platform"
                class="object-contain p-2 h-32 border-r-2 border-gray-200"
            >
            <div class="flex-1 ml-4">
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ contest.title }}
              </h3>
              <p class="text-gray-600 mb-2">
                <i class="fa-regular fa-clock"></i>
                {{ formatContestTime(contest.startTime, contest.endTime) }}
                <span class="text-gray-500 text-sm">
                  ({{ formatDuration(contest.duration) }})
                </span>
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
          </div>

        </div>
      </div>
      <!-- 分页 -->
      <div class="mt-8 mx-auto flex justify-center">
        <el-pagination
            :page-size="contestsPerPage"
            :total="totalPages*contestsPerPage"
            :pager-count="11"
            layout="prev, pager, next"
            @current-change="handlePageChange"
        />
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {ref, computed, watch, onMounted} from "vue";
import Header from "@/components/Header.vue";
import {get_contest_list} from "@/api/contest";
import {Timer} from "@element-plus/icons-vue";

// 平台数据
const platforms = [
  { id: "all", name: "全部平台" },
  { id: "Codeforces", name: "Codeforces" },
  { id: "AtCoder", name: "AtCoder" },
  { id: "Nowcoder", name: "牛客网" },
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

const totalPages = ref(3);
const contestsPerPage = ref(5);
const currentPage = ref(1);

watch(
  () => currentPage,
  (newVal) => {
    console.log(newVal);
  },
);

// 比赛状态类型
type ContestStatus = "upcoming" | "ongoing" | "ended";

// 比赛数据接口
interface Contest {
  id: string;
  title: string;
  platform: string;
  startTime: number;
  endTime: number;
  duration: number;
  status: ContestStatus;
  url: string;
}

// 当前选中的平台
const selectedPlatform = ref("all");

// 模拟比赛数据
const contests = ref<Contest[]>([]);

onMounted(() => {
  LoadContests();
})

const IsLoading = ref(false);

// 加载比赛
const LoadTime = ref(0);
const LoadContests = async () => {
  contests.value = [];
  LoadTime.value = new Date().getTime();
  const NowLoadTime = LoadTime.value;

  const data = await get_contest_list({
    type: selectedPlatform.value,
    page : currentPage.value,
    count : contestsPerPage.value,
  })
  console.log(data)
  if (data.data.data.length > 0) {
    // 循环加入帖子列表
    for (const contest of data.data.data.contests) {
      console.log(contest);
      if (LoadTime.value != NowLoadTime) {
        // 不再加载此次数据，退出循环
        break;
      }
      let status: ContestStatus = "upcoming";
      if (contest.start_time < new Date().getTime() && contest.end_time > new Date().getTime()) {
        status = "ongoing";
      } else if (contest.end_time < new Date().getTime()) {
        status = "ended";
      }
      contests.value.push({
        id: contest.id,
        title: contest.title,
        platform: contest.platform,
        startTime: contest.start_time,
        endTime: contest.end_time,
        duration: contest.duration,
        status: status,
        url: contest.url,
      });
    }
  }
  totalPages.value = data.data.data.page_total
  IsLoading.value = false;
}

// 选择平台
const selectPlatform = (platformId: string) => {
  selectedPlatform.value = platformId;
  LoadContests();
};

// setInterval(() => {
//   console.log(contests.value.length);
// }, 100);

// 格式化比赛时间
const formatContestTime = (startTime: number, endTime: number) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return `${formatDate(startTime)} 至 ${formatDate(endTime)}`;
};

const formatDuration = (duration: number) => {
  const seconds = duration % 60;
  duration = Math.floor(duration / 60);
  const minutes = duration % 60;
  duration = Math.floor(duration / 60);
  const hours = duration % 24;
  duration = Math.floor(duration / 24);
  const days = duration;


  let result = "";
  if (days > 0) {
    result += `${days} 天`;
  }
  if (hours > 0) {
    result += ` ${hours} 小时`;
  }
  if (minutes > 0) {
    result += ` ${minutes} 分`;
  }
  if (seconds > 0) {
    result += ` ${seconds} 秒`;
  }
  result += " ";
  return result;
}

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

// 处理分页
const handlePageChange = (val: number) => {
  currentPage.value = val;
  LoadContests();
  console.log("当前页码:", currentPage.value);
  // 这里可以添加获取对应页数据的逻辑
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
