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

        <form>
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
                  class="w-2/3 px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
                  maxlength="255"
              />
              <button
                  type="button"
                  @click="triggerFileUpload"
                  class="float-right w-3/7 px-3 py-3 bg-gray-800 text-white text-sm rounded-md focus:outline-none"
              >
                上传本地图片
              </button>
              <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  accept="image/*"
                  @change="handleFileUpload"
              >
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
                @click = "saveUserInfo"
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
import router from "@/router";
import {upload_image} from "@/api/file";
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
]);

// 帖子数据
const posts = ref([
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
    const data2 = await set_role({id: String(route.params.id), role: editForm.value.role});
    console.log("修改权限请求:",data2);
  }
  // 修改用户信息
  const data = await set_profile({
    id : String(route.params.id),
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
  if (UserStore.getUserInfo().role == 0) {
    // 权限更改，需要重新登录
    UserStore.logout();
    addMessage('身份发生变化，请重新登录','info')
    setTimeout(() => {
      router.push("/login");
    },1000)
  }

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

// 在setup部分添加：
const fileInput = ref<HTMLInputElement | null>(null);

// 触发文件选择
const triggerFileUpload = () => {
  fileInput.value?.click();
};

// 处理文件上传
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // 验证文件类型和大小（限制5MB）
  if (!file.type.startsWith('image/')) {
    addMessage('只能上传图片文件', 'error');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    addMessage('文件大小不能超过5MB', 'error');
    return;
  }

  try {
    addMessage('上传中...', 'info');
    const formData = new FormData();
    formData.append('file', file);

    const response = await upload_image(formData);

    if (response.data.code === 20000) {
      editForm.value.avatarUrl = response.data.data.url;
      addMessage('上传成功', 'success');
    }
  } catch (error) {
    addMessage('上传失败，请稍后重试', 'error');
    console.error('Upload error:', error);
  } finally {
    // 清空input值以允许重复上传同一文件
    if (fileInput.value) fileInput.value.value = '';
  }
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
