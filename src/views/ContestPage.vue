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
            v-for="(contest,index) in contests"
            :key="contest.id"
            class="animation-delay contest-card bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            @click="goToUrl(contest.url)"
            :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="p-4 flex justify-between items-center">
            <img
                :src="logo(contest.platform)"
                :alt="contest.platform"
                class="object-contain p-2 h-32 border-r-2 border-gray-200"
            >
            <div class="flex-1 ml-4">
              <h3 class="text-xl font-bold mb-2"
                  :class="{ 'text-yellow-400': contest.isRecommend , 'text-gray-900':!contest.isRecommend }"
              >
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
            <div class="mr-4 flex items-center">
              <div v-if="contest.startTime > new Date().getTime()+1000*60*20"
                @click.stop="BookingContest(contest)"
              >
                <div v-if="contest.isBooking">
                  <el-button :disabled="contest.isBookingDisabled" plain round >
                    <el-icon class="mr-2"><Bell /></el-icon>
                    预约
                  </el-button>
                </div>
                <div v-else>
                  <el-button :disabled="contest.isBookingDisabled" type="primary" round>
                    <el-icon class="mr-2" ><Bell /></el-icon>
                    预约
                  </el-button>
                </div>

              </div>
              <div v-else>
                <el-button type="success" round
                  @click.stop="goToContestDetail(contest.id)"
                >
                  <el-icon class="mr-2"><ChatLineSquare /></el-icon>
                  题解
                </el-button>
              </div>

              <div v-if="IsAdmin" class="ml-2">
                <el-button :icon="Setting" size="large" circle text @click.stop="OpenEditForm(contest)"/>
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
    <div v-if="IsAdmin" class="floating-component">
      <div
          class="bg-blue-400 rounded-md shadow-lg p-4 duration-300 hover:scale-105 hover:bg-blue-500 cursor-pointer"
          @click="navigateTo('/contest/create')"
      >
        <i class="fas fa-add text-white text-2xl w-6 h-5"></i>
      </div>
    </div>
    <el-dialog
        v-model="centerDialogVisible"
        title="比赛设置"
        width="500"
        align-center
    >
      <span>精选比赛</span>
      <el-switch
          v-model="IsRecommend"
          class="ml-2"
      />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="postContestSetting()">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, watch, onMounted} from "vue";
import Header from "@/components/Header.vue";
import {get_contest_list, get_booking, create_booking, set_recommend} from "@/api/contest";
import {Timer, Bell, ChatLineSquare, Plus, Setting} from "@element-plus/icons-vue";
import router from "@/router";
const { addMessage } = useMessage()

import {useUserStore} from "@/store/user";
import {CodeHandler, useMessage} from "@/store/message";
const userStore = useUserStore();

const centerDialogVisible = ref(false)

const IsAdmin = computed(() => {
  if (userStore.getUserInfo().role>=3) {
    return true;
  }
});

// 平台数据
const platforms = [
  { id: "all", name: "全部平台" },
  { id: "Codeforces", name: "Codeforces" },
  { id: "AtCoder", name: "AtCoder" },
  { id: "Nowcoder", name: "牛客网" },
  { id: "AcKing", name: "其他" },
  { id: "recommend",name:"精选比赛"}
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
  isBooking: boolean;
  isBookingDisabled: boolean;
  isRecommend: boolean;
}

const BookingContest = async (contest: Contest) => {
  contest.isBookingDisabled = true;
  setTimeout(() => {
    contest.isBookingDisabled = false;
  },300)
  const data = await create_booking({
    contest_id: contest.id,
  })
  console.log(data);
  if (data.data.code === 20000) {
    if (data.data.data.is_booking) {
      addMessage('预约成功','success')
    } else {
      addMessage('取消预约成功','success')
    }
  } else {
    addMessage('操作失败', 'error')
  }
  contest.isBooking = !contest.isBooking;
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
      const data_booking = await get_booking({
        contest_id: contest.id,
      })
      console.log(data_booking)
      contests.value.push({
        id: contest.id,
        title: contest.title,
        platform: contest.platform,
        startTime: contest.start_time,
        endTime: contest.end_time,
        duration: contest.duration,
        status: status,
        url: contest.url,
        isBooking: data_booking.data.data.is_booking,
        isBookingDisabled: false,
        isRecommend: contest.is_recommend,
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

// 编辑表单
const IsRecommend = ref(false);
const selectedContest = ref<Contest>();

const OpenEditForm = (contest: Contest) => {
  centerDialogVisible.value = true;
  IsRecommend.value = contest.isRecommend;
  selectedContest.value = contest;
};

const postContestSetting = async () => {
  // 发送请求
  const data = await set_recommend({
    contest_id: selectedContest.value?.id,
    is_recommend: IsRecommend.value,
  })
  console.log(data);
  if (data.data.code === 20000) {
    addMessage('设置成功','success')
    selectedContest.value.isRecommend = IsRecommend.value
  } else {
    addMessage('设置失败', 'error')
  }
  // 关闭窗口
  centerDialogVisible.value = false
}




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

// 跳转到比赛链接
const goToUrl = (url: string) => {
  window.open(url, "_blank");
};

// 跳转到比赛详情
const goToContestDetail = (contest_id: string) => {
  router.push(`/contest/${contest_id}`);
};

// 处理分页
const handlePageChange = (val: number) => {
  currentPage.value = val;
  LoadContests();
  console.log("当前页码:", currentPage.value);
  // 这里可以添加获取对应页数据的逻辑
};

const navigateTo = (url : string) => {
  router.push(url);
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

.floating-component {
  position: fixed; /* 固定位置 */
  bottom: 5%; /* 下边距 */
  right: 5%; /* 右边距 */
  z-index: 10; /* 设置 z-index 确保悬浮在顶层 */
}

.animation-delay {
  animation: fadeInUp 0.6s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 30px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
