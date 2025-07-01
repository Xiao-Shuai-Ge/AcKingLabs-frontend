<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <!-- 头部区域 -->
    <div
        class="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-400 py-8 mt-14"
    >
      <div class="container mx-auto px-6 relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold text-white text-center mt-4">
          排行榜
        </h1>
      </div>
    </div>
    <div class="max-w-2xl mx-auto space-y-4 transition-all duration-300 cursor-pointer mt-10">
      <div v-for="(user, index) in List" :key="user.id" class="animation-delay"
          @click="navigateToProfile(user.id)"
      >
        <div class="flex">
          <div class="flex border border-gray-200 rounded-lg p-2 px-4 shadow-md mr-2 text-center text-lg font-bold min-w-14"
            :class="GetBGColor( index + 1 + perPage * (page - 1) )"
          >
            {{ index + 1 + perPage * (page - 1) }}
          </div>
          <div class="flex w-full border border-gray-200 p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
               :class="GetBGColor( index + 1 + perPage * (page - 1) )"
          >
            <img
                :src="user.avatar"
                alt="Avatar"
                class="w-6 h-6 rounded-full border border-black"
            />
            <h2 class="text-center text-lg font-bold ml-2"
                :class="GetTextColor(CheckLevel(user.xp, user.role))"
            >
              {{ user.name }}
            </h2>
            <p class="text-center text-lg ml-auto font-bold"
               :class="GetTextColor(CheckLevel(user.xp, user.role))"
            >
              {{ user.xp }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="mt-8 mx-auto flex justify-center pb-8">
      <el-pagination
          :page-size="perPage"
          :total="total*perPage"
          :pager-count="11"
          layout="prev, pager, next"
          @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import { ref, onMounted } from "vue";
import {get_rankings} from "@/api/user";
import {CheckLevel, GetTextColor} from "@/utils/level";
import router from "@/router";


interface User {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  role: number;
}
const List = ref<Array<User>>([]);

const page = ref(1);
const perPage = ref(10);
const total = ref(1);

// 处理分页
const handlePageChange = (val: number) => {
  page.value = val;
  getList();
};

onMounted(() => {
  getList();
});

const getList = async () => {
  List.value = []
  const data = await get_rankings({
    page: page.value,
    count: perPage.value
  });
  console.log(data)
  for (const user of data.data.data.rankings) {
    List.value.push({
      id: user.id,
      name: user.username,
      avatar: user.avatar,
      xp: user.xp,
      role: user.role,
    });
  }
  total.value = data.data.data.page_total;
}

// 前往个人主页
const navigateToProfile = (id : string) => {
  router.push({
    path: "/profile/"+id,
  });
};

const GetBGColor = (rank: number) => {
  if (rank === 1) {
    return "bg-red-50";
  } else if (rank === 2) {
    return "bg-orange-50";
  } else if (rank === 3) {
    return "bg-yellow-50";
  } else if (rank >= 4 && rank <= 15) {
    return "bg-blue-50";
  } else if (rank >= 16 && rank <= 30) {
    return "bg-green-50";
  } else {
    return "bg-white";
  }
}

</script>

<style scoped>
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
