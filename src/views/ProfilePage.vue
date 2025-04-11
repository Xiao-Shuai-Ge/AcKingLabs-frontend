<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div
      class="min-h-screen bg-white text-gray-900 flex flex-col items-center py-10 px-4"
  >
    <Header />
    <!-- 个人信息区域 -->
    <div class="relative w-full max-w-4xl flex flex-col items-center mb-10 mt-10">
      <!-- 头像和用户名 -->
      <div class="relative group">
        <div
            class="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-800 shadow-lg mb-4 group-hover:scale-105 transition-transform duration-300"
        >
          <img
              :src="userInfo.avatarUrl"
              alt="用户头像"
              class="w-full h-full object-cover object-top"
          />
        </div>
        <div v-if="isCanEdit">
          <button
              @click="openEditModal"
              class="absolute top-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-600 transition-colors duration-300"
          >
            <i class="fas fa-pencil-alt"></i>
          </button>
        </div>
      </div>
      <h1 class="text-3xl font-bold mb-8" :class = GetTextColor(userInfo.level) >{{ userInfo.username }}</h1>

      <!-- 个人详细信息卡片 -->
      <div
          class="w-full bg-white border-2 border-gray-800 rounded-lg p-6 shadow-lg"
      >
        <div class="mb-6">
          <p class="text-sm text-gray-600 mb-1">经验值</p>
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div
                class="h-4 rounded-full"
                :class = GetBgColor(userInfo.level)
                :style="{ width: `${userInfo.experiencePercentage}%` }"
            ></div>
          </div>
          <div class="text-right text-sm mt-1">
            {{ userInfo.experience }} / {{ userInfo.maxExperience }}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col space-y-4">
            <div>
              <p class="text-sm text-gray-600">真实姓名</p>
              <p class="font-medium">{{ userInfo.realName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">年级</p>
              <p class="font-medium">{{ userInfo.grade }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">学号</p>
              <p class="font-medium">{{ userInfo.studentId }}</p>
            </div>
          </div>
          <div class="flex flex-col space-y-4">
            <div>
              <p class="text-sm text-gray-600">Codeforces ID</p>
              <a
                  :href="`https://codeforces.com/profile/${userInfo.codeforcesId}`"
                  target="_blank"
                  class="font-medium text-blue-600 hover:underline cursor-pointer"
              >{{ userInfo.codeforcesId }}</a
              >
            </div>
            <div>
              <p class="text-sm text-gray-600">Codeforces Rating</p>
              <p class="font-medium" :class="getRatingColorClass()">
                {{ userInfo.codeforcesRating }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容展示区域 -->
    <div class="w-full max-w-4xl">
      <div class="border-b-2 border-gray-800 mb-6">
        <div class="flex">
          <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
              'px-6 py-3 font-medium cursor-pointer whitespace-nowrap',
              activeTab === tab.id ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- 打卡周记列表 -->
      <div v-if="activeTab === 'weeklyReports'" class="space-y-4">
        <div
            v-if="weeklyReports.length === 0"
            class="text-center py-10 text-gray-500"
        >
          暂无打卡周记
        </div>
        <div
            v-for="report in weeklyReports"
            :key="report.id"
            class="border-2 border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold">{{ report.title }}</h3>
            <span class="text-sm text-gray-500">{{ report.date }}</span>
          </div>
          <p class="text-gray-700 line-clamp-2">{{ report.content }}</p>
        </div>
        <div v-if="weeklyReports.length > 0" class="mt-6 flex justify-center">
          <button
              class="px-4 py-2 border-2 border-gray-800 text-gray-800 font-medium rounded hover:bg-gray-100 cursor-pointer whitespace-nowrap !rounded-button"
          >
            加载更多
          </button>
        </div>
      </div>

      <!-- 帖子列表 -->
      <div v-if="activeTab === 'posts'" class="space-y-4">
        <div v-if="posts.length === 0" class="text-center py-10 text-gray-500">
          暂无帖子
        </div>
        <div
            v-for="post in posts"
            :key="post.id"
            class="border-2 border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold">{{ post.title }}</h3>
            <span class="text-sm text-gray-500">{{ post.date }}</span>
          </div>
          <p class="text-gray-700 line-clamp-2">{{ post.content }}</p>
          <div class="flex items-center mt-3 text-sm text-gray-500">
            <span class="flex items-center mr-4">
              <i class="far fa-eye mr-1"></i> {{ post.views }}
            </span>
            <span class="flex items-center mr-4">
              <i class="far fa-comment mr-1"></i> {{ post.comments }}
            </span>
            <span class="flex items-center">
              <i class="far fa-thumbs-up mr-1"></i> {{ post.likes }}
            </span>
          </div>
        </div>
        <div v-if="posts.length > 0" class="mt-6 flex justify-center">
          <button
              class="px-4 py-2 border-2 border-gray-800 text-gray-800 font-medium rounded hover:bg-gray-100 cursor-pointer whitespace-nowrap !rounded-button"
          >
            加载更多
          </button>
        </div>
      </div>
    </div>

    <!-- 修改信息弹窗 -->
    <div
        v-if="showEditModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeEditModal"
    >
      <div
          class="bg-white rounded-lg w-full max-w-md p-6 shadow-xl animate-fade-in"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">修改个人信息</h2>
          <button
              @click="closeEditModal"
              class="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="saveUserInfo">
          <div class="mb-6 flex flex-col items-center">
            <div
                class="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-800 mb-2 relative group"
            >
              <img
                  :src="editForm.avatarUrl"
                  alt="用户头像"
                  class="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                头像
                <span class="text-gray-500 text-sm">
                  (使用第三方图床上传，例如:
                  <a href="https://imgurl.org" class="text-blue-400">
                    https://imgurl.org
                  </a>
                  )
                </span>
              </label>
              <input
                  v-model="editForm.avatarUrl"
                  type="text"
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
                  maxlength="100"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
              >昵称*(必填)</label
              >
              <input
                  v-model="editForm.username"
                  type="text"
                  class="w-full px-3 py-2 border-2  rounded-md focus:outline-none "
                  :class = "{
                     'border-red-500':DisabledUsername,
                     'border-gray-300 focus:border-gray-800':!DisabledUsername,
                  }"
                  maxlength="30"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
              >真实姓名*(必填)</label
              >
              <input
                  v-model="editForm.realName"
                  type="text"
                  class="w-full px-3 py-2 border-2  rounded-md focus:outline-none "
                  :class = "{
                     'border-red-500':DisabledRealname,
                     'border-gray-300 focus:border-gray-800':!DisabledRealname,
                  }"
                  maxlength="20"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
              >年级</label
              >
              <input
                  v-model="editForm.grade"
                  type="number"
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
                  @input="limitNumberLength"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
              >学号</label
              >
              <input
                  v-model="editForm.studentId"
                  type="text"
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
                  maxlength="20"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
              >Codeforces ID</label
              >
              <input
                  v-model="editForm.codeforcesId"
                  type="text"
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
                  maxlength="30"
              />
            </div>

            <div v-if="isSuperAdmin">
              <label class="block text-sm font-medium text-gray-700 mb-1">用户身份</label>
              <select
                  v-model="editForm.role"
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
              >
                <option :value="0">游客</option>
                <option :value="1">普通成员</option>
                <option :value="2">正式成员</option>
                <option :value="3">管理员</option>
              </select>
            </div>
          </div>

          <div class="mt-8 flex justify-end space-x-4">
            <button
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer whitespace-nowrap !rounded-button"
            >
              取消
            </button>
            <button
                type="submit"
                class="px-4 py-2 text-white rounded-md  cursor-pointer whitespace-nowrap !rounded-button"
                :disabled = "DisabledSaveButton"
                :class = "{'bg-gray-300':DisabledSaveButton, 'bg-gray-800 hover:bg-gray-700':!DisabledSaveButton}"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted, watch} from "vue";
import Header from "@/components/Header.vue";
import {get_user_profile, set_profile,set_role} from "@/api/user";
import {useRoute} from "vue-router";
import {CheckLevel, GetTextColor, GetBgColor, NextLevelLimit} from "@/utils/level";
import {useUserStore} from "@/store/user";

// 使用信息框
import { useMessage } from '@/store/message'
const { addMessage } = useMessage()

// 登录信息
const UserStore = useUserStore();

// 用户信息
const userInfo = ref({
  userid:"",
  username: "",
  avatarUrl:
      "",
  realName: "",
  grade: 24,
  studentId: "",
  codeforcesId: "",
  codeforcesRating: 0,
  experience: 0,
  maxExperience: 0,
  experiencePercentage: 20,
  role : 0,
  level: 0,
  nextLevelXp : 0
});

const route = useRoute()

onMounted( async () => {
  LoadUserInfo();
})

const LoadUserInfo = async () => {
  addMessage('加载中...', 'info')
  const data = await get_user_profile({id: String(route.params.id)})
  console.log(data)
  // 头像
  if (data.data.data.avatar.length > 0) {
    userInfo.value.avatarUrl = data.data.data.avatar;
  } else {
    console.log("用户头像为空");
    userInfo.value.avatarUrl = "/assets/default_avatar.png";
  }
  // 用户ID
  userInfo.value.userid = String(route.params.id);
  // 用户名
  userInfo.value.username = data.data.data.username;
  // 姓名
  console.log("姓名"+data.data.data.real_name)
  userInfo.value.realName = format(data.data.data.real_name);
  // 年级
  userInfo.value.grade = data.data.data.grade;
  // 学号
  userInfo.value.studentId = format(data.data.data.student_no);
  // Codeforces ID
  userInfo.value.codeforcesId = format(data.data.data.codeforces_id);
  // Codeforces Rating
  userInfo.value.codeforcesRating = data.data.data.codeforces_rating;
  // 经验
  userInfo.value.experience = data.data.data.xp;
  // 权限角色
  userInfo.value.role = data.data.data.role;

  console.log("用户权限等级:",data.data.data.role)
  // 等级
  userInfo.value.level = CheckLevel(data.data.data.xp,data.data.data.role);
  console.log("等级",userInfo.value.level);

  // 渲染经验条
  userInfo.value.nextLevelXp = NextLevelLimit(data.data.data.xp,data.data.data.role)
  userInfo.value.maxExperience = userInfo.value.nextLevelXp;
  if (userInfo.value.nextLevelXp==0) {
    userInfo.value.experiencePercentage = 100;
  } else {
    userInfo.value.experiencePercentage = userInfo.value.experience * 100 / userInfo.value.nextLevelXp;
    if (userInfo.value.experiencePercentage > 100) {
      userInfo.value.experiencePercentage = 100;
    }
  }

  console.log("我的权限",UserStore.getUserInfo().role)

  addMessage('加载成功', 'success')
}

// 判断是否可以编辑
const isCanEdit = computed(() => {
  if (UserStore.isLogin()) {
    if (UserStore.getUserInfo().user_id === userInfo.value.userid) {
      return true;
    } else if (UserStore.getUserInfo().role >= 3) {
      // 管理员可修改所有用户信息
      return true;
    }
  }
  return false;
});

// 判断是否是超级管理员
const isSuperAdmin = computed(() => {
  if (UserStore.isLogin()) {
    if (UserStore.getUserInfo().role >= 4) {
      return true;
    }
  }
  return false;
})

const format = (s:string) => {
  if (s.length > 0) return s;
  else return "无";
}

// 标签页
const tabs = [
  { id: "weeklyReports", name: "打卡周记" },
  { id: "posts", name: "帖子" },
];
const activeTab = ref("weeklyReports");

// 打卡周记数据
const weeklyReports = ref([
  {
    id: 1,
    title: "第十二周学习总结",
    date: "2025-04-01",
    content:
        "本周主要学习了动态规划的基本概念和常见应用场景，完成了LeetCode上5道相关题目。同时，复习了红黑树的基本操作和平衡性维护算法。在周末，参加了一场Codeforces比赛，虽然只解出了3道题，但收获了不少经验。下周计划深入学习网络流算法和最小生成树的应用。",
  },
  {
    id: 2,
    title: "第十一周学习总结",
    date: "2025-03-25",
    content:
        "这周重点研究了贪心算法的证明方法和适用条件，解决了几个经典问题如区间调度和哈夫曼编码。同时开始学习图论中的最短路径算法，包括Dijkstra和Bellman-Ford算法的实现与优化。周三参加了校内算法竞赛，获得了不错的成绩，但在复杂数据结构的应用上还有提升空间。",
  },
  {
    id: 3,
    title: "第十周学习总结",
    date: "2025-03-18",
    content:
        "本周主要学习了回溯算法和分治法，并用这些方法解决了几个经典问题，如N皇后和归并排序。此外，还复习了二叉搜索树的基本操作和性质。在实践方面，完成了一个小型的命令行工具，用于文本文件的批量处理，这让我对文件I/O和字符串处理有了更深入的理解。",
  },
]);

// 帖子数据
const posts = ref([
  {
    id: 1,
    title: "如何高效准备算法竞赛？分享我的备赛经验",
    date: "2025-04-05",
    content:
        "作为一名参加过多次算法竞赛的选手，我想分享一些个人的备赛心得。首先，建立系统的知识体系非常重要，可以按照基础算法、数据结构、动态规划、图论、数学等方向逐步学习。其次，刷题一定要有针对性，不要盲目追求数量，而是要理解每道题背后的思想和技巧。此外，模拟比赛环境也很重要，可以定期参加在线比赛，锻炼自己的应变能力和心理素质。最后，团队合作和交流也是提高的重要途径，可以和同学一起讨论问题，互相启发。",
    views: 328,
    comments: 42,
    likes: 156,
  },
  {
    id: 2,
    title: "动态规划入门指南：从零开始理解DP",
    date: "2025-03-30",
    content:
        "动态规划是算法竞赛中的重要内容，也是很多初学者的拦路虎。本文将从最基础的概念出发，通过具体例子详细讲解动态规划的思想和应用方法。我们会从简单的一维DP开始，如斐波那契数列、最长递增子序列，逐步过渡到二维DP如背包问题、编辑距离等。每个问题都会提供详细的状态定义、转移方程和代码实现，希望能帮助大家建立对动态规划的直观理解。",
    views: 256,
    comments: 35,
    likes: 128,
  },
  {
    id: 3,
    title: "我在Codeforces比赛中遇到的有趣问题及解法",
    date: "2025-03-20",
    content:
        '上周参加了Codeforces Round #842，遇到了一道非常有趣的图论问题。题目要求在一个无向图中找到一条路径，使得路径上的最大边权值最小。这是一个典型的"最小瓶颈路径"问题，可以使用Kruskal算法的变种来解决。本文将详细分析问题的特点，并提供几种不同的解法，包括二分查找+BFS、Dijkstra算法的变形等。同时也会讨论各种方法的时间复杂度和适用场景。',
    views: 189,
    comments: 23,
    likes: 87,
  },
]);

// 编辑表单
const showEditModal = ref(false);
const editForm = ref({
  username: "",
  avatarUrl: "",
  realName: "",
  grade: 0,
  studentId: "",
  codeforcesId: "",
  role: 0,
});

// 年级选项
const grades = ["大一", "大二", "大三", "大四", "研一", "研二", "研三", "博士"];

// 打开编辑弹窗
const openEditModal = () => {
  editForm.value = { ...userInfo.value };
  showEditModal.value = true;
};

// 关闭编辑弹窗
const closeEditModal = () => {
  showEditModal.value = false;
};

// 保存用户信息
const saveUserInfo = async () => {
  // 修改 role
  if (userInfo.value.role != editForm.value.role) {
    const data2 = await set_role({id: editForm.value.userid, role: editForm.value.role});
    console.log("修改权限请求:",data2);
  }
  // 修改用户信息
  const data = await set_profile({
    id : editForm.value.userid,
    username: editForm.value.username,
    avatar: editForm.value.avatarUrl,
    real_name: editForm.value.realName,
    grade: editForm.value.grade,
    student_no: editForm.value.studentId,
    codeforces_id: editForm.value.codeforcesId,
  })
  if (data.data.code != 20000) {
    addMessage('保存失败', 'error')
    return;
  }
  addMessage('保存成功','success')

  console.log("修改用户请求:",data);
  // userInfo.value = { ...userInfo.value, ...editForm.value };
  // 刷新页面
  await LoadUserInfo();
  closeEditModal();
};

const DisabledSaveButton = ref(false);
const DisabledRealname = ref(false);
const DisabledUsername = ref(false);

// 不能包含 空格
let reg_realname = new RegExp("^[^\\s]{2,20}$");
let reg_username = new RegExp("^[^\\s]{0,30}$");

// 监听编辑表单变化
watch(
    () => editForm.value.realName,
    (newName) => {
      if (!reg_realname.test(newName) || newName === "") {
        DisabledRealname.value = true;
        console.log(newName,"不符合");
        handleDisabled()
      } else {
        DisabledRealname.value = false;
        handleDisabled()
      }
    }
);
watch(
    () => editForm.value.username,
    (newName) => {
      if (!reg_username.test(newName) || newName === "") {
        DisabledUsername.value = true;
        console.log(newName,"不符合");
        handleDisabled()
      } else {
        DisabledUsername.value = false;
        handleDisabled()
      }
    }
);

const handleDisabled = () => {
  DisabledSaveButton.value = DisabledRealname.value && DisabledUsername.value;
}

// 限制输入数字长度
const limitNumberLength = (event) => {
  if (event.target.value.length > 2) {
    event.target.value = event.target.value.slice(0, 2);
  }
};

// 根据rating获取颜色类
const getRatingColorClass = () => {
  const rating = userInfo.value.codeforcesRating;
  if (rating < 1200) return "text-gray-500"; // Newbie
  if (rating < 1400) return "text-green-600"; // Pupil
  if (rating < 1600) return "text-cyan-600"; // Specialist
  if (rating < 1900) return "text-blue-600"; // Expert
  if (rating < 2100) return "text-purple-600"; // Candidate Master
  if (rating < 2400) return "text-orange-500"; // Master
  if (rating < 2600) return "text-orange-600"; // International Master
  if (rating < 3000) return "text-red-600"; // Grandmaster
  return "text-red-700"; // International Grandmaster
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
