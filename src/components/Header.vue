<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div>
    <nav
        class="fixed top-0 left-0 w-full h-[60px] bg-white shadow-sm z-50 flex items-center justify-between"
    >
      <!-- Logo区域 -->
      <div class="flex items-center ml-5 w-1/6"
           @click="navigateTo('/')"
      >
        <img class="h-10 mr-2" src="/assets/AcKing_black.png" alt="公司Logo" />
        <span class="font-semibold" v-if="!isMobile">AcKing 学习分享平台</span>
      </div>

      <!-- 功能导航 -->
      <div
          class="flex items-center justify-center overflow-x-auto hide-scrollbar h-full flex-1 w-2/3"
      >
        <div class="flex h-full mx-auto">
          <div
              v-for="(item, index) in navItems"
              :key="index"
              @click="navigateTo(item.path)"
              :class="[
              'px-3 py-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap !rounded-button text-center pt-3',
              isMobile ? 'w-12 text-sm' : 'w-32 text-xl',

              $route.path.startsWith(item.path) ? 'bg-black text-white border-b-4' : 'text-gray-800 hover:bg-gray-100 border-l-2 border-r-1',
              $route.path.startsWith(item.path) ? item.color:'border-gray-100'
            ]"
          >
            <span class="relative z-10 mr-2" v-if="!isMobile">{{ item.name }}</span>
            <i :class="item.icon"></i>
          </div>
        </div>
      </div>


      <!-- 用户信息 -->
      <div
          class="flex items-center mr-5 relative w-1/6"
          @mouseenter="openDropdown()"
          @mouseleave="closeDropdown()"
      >
        <div class="flex items-center cursor-pointer ml-auto">
          <span v-if="myLevel === 0" class="text-sm text-gray-500 mr-1">(未实名)</span>
          <span class="text-base font-bold mr-2" :class = GetTextColor(myLevel)>{{ userName }}</span>
          <div class="w-9 h-9 rounded-full overflow-hidden bg-gray-200 mr-2.5">
            <img
                :src="userAvatarUrl"
                alt="用户头像"
                class="w-full h-full object-cover object-top"
                @click="navigateTo('/login')"
            />
            <!-- 消息提示红点 -->
            <span
                v-if="MessageCount > 0"
                class="absolute  -bottom-1 right-1 bg-red-500 text-white rounded-full text-xs min-w-[18px] h-[18px] flex items-center justify-center px-1"
            >
              {{ MessageCount > 99 ? '99+' : MessageCount }}
            </span>
          </div>
<!--          <i class="fas fa-chevron-down text-xs ml-2 text-gray-500"></i>-->
        </div>

        <!-- 下拉菜单 -->
        <div
            v-show="showDropdown && userName"
            class="absolute right-0 top-full mt-1 w-40 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-200 z-10"
        >
          <div
              v-for="(option, index) in dropdownOptions"
              :key="index"
              class="px-5 py-2.5 hover:bg-gray-100 cursor-pointer transition-all duration-200 text-sm"
              @click = "option.click"
          >
            <i :class="['mr-2', option.icon]"></i>
            {{ option.label }}
            <span v-if="option.label === '消息通知' && MessageCount > 0"
              class="text-sm text-white bg-red-500 rounded-full ml-1 px-1 w-4 h-4 items-center justify-center"
            >
              {{ MessageCount }}
            </span>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import router from "@/router";
import {my_info} from "@/api/user";
import {useUserStore} from "@/store/user";
import {CheckLevel, GetTextColor} from "@/utils/level";
import {get_message_count} from "@/api/message";

// 判断是否是移动端
const isMobile = ref(false);
onMounted(() => {
  const ua = navigator.userAgent.toLowerCase();
  isMobile.value = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  console.log(isMobile.value);
});

const MessageCount = ref(0);

// 导航项
const navItems = ref([
  { name: "打卡", path: "/diary" , icon: "fa-solid fa-square-check" , color : "border-blue-500" },
  { name: "学习", path: "/learn" , icon: "fa-solid fa-book-open-reader" , color : "border-yellow-500"},
  { name: "比赛", path: "/contest" , icon: "fa-solid fa-chart-simple" , color : "border-red-500" },
  { name: "更多", path: "/more" , icon: "fa-solid fa-bars" , color : "border-green-500" },
]);

// 下拉菜单选项
const dropdownOptions = ref([
  { label: "个人主页", icon: "fas fa-user" , click: () => navigateToProfile() },
  { label: "消息通知", icon: "fas fa-bell" , click: () => navigateTo("/message") },
  { label: "退出登录", icon: "fas fa-sign-out-alt" , click: () => logout() },
]);

// 前往个人主页
const navigateToProfile = () => {
  navigateTo("/profile/"+myID.value)
};

const UserStore = useUserStore();

// 退出登录方法
const logout = () => {
  console.log("退出登录");
  UserStore.logout();
  navigateTo('/login');
}

// 导航跳转方法
const navigateTo = (path: string) => {
  router.push({
    path: path,
  });
};

// 当前激活的导航索引
const activeNavIndex = ref(0);

// 下拉菜单显示状态
const showDropdown = ref(false);

// 用户信息
const myID = ref("");
const userName = ref("");
const userAvatarUrl = ref(
    "/assets/not_logged_in.png",
);

const myXp = ref(0);
const myRole = ref(0);
const myLevel = ref(0);

onMounted(async () => {
  // 判断用户是否登录
  if (UserStore.isLogin()) {
    // 先读取本地
    const localData = UserStore.getUserInfo();
    myID.value = localData.user_id;
    userName.value = localData.username;
    userAvatarUrl.value = localData.avatar;
    myRole.value = localData.role;
    myXp.value = localData.xp;
    myLevel.value = CheckLevel(myXp.value,myRole.value);
    // 从服务器获取用户信息
    const data = await my_info();
    if (data.data.code != 20000) {
      console.log("用户未登录");
      userName.value = ""
      userAvatarUrl.value = "/assets/not_logged_in.png";
    } else {
      myID.value = data.data.data.id;
      userName.value = data.data.data.username;
      myRole.value = data.data.data.role;
      myXp.value = data.data.data.xp;
      myLevel.value = CheckLevel(myXp.value,myRole.value);
      if (data.data.data.avatar.length > 0) {
        userAvatarUrl.value = data.data.data.avatar;
      } else {
        console.log("用户头像为空");
        userAvatarUrl.value = "/assets/default_avatar.png";
      }
    }
    // 保存到本地
    UserStore.setUserInfo({
      user_id : myID.value,
      username : userName.value,
      avatar : userAvatarUrl.value,
      role : myRole.value,
      xp : myXp.value,
    });
    await GetMessageCount();
  } else {
    console.log("用户未登录");
    userName.value = ""
    userAvatarUrl.value = "/assets/not_logged_in.png";
  }
})

const GetMessageCount = async () => {
  const data = await get_message_count();
  if (data.data.code != 20000) {
    console.error("获取消息通知失败");
    return;
  }
  MessageCount.value = data.data.data.count;
}
// onMounted( async () => {
//   // 先从本地存储中获取用户名和头像
//   const username = localStorage.getItem('username')
//   const avatar = localStorage.getItem('avatar')
//   if (username && avatar) {
//     userName.value = username
//     userAvatarUrl.value = avatar
//     myID.value = ""
//   }
//   // 获取用户信息
//   const data = await my_info();
//   if (data.data.code != 20000) {
//     console.log("用户未登录");
//     userName.value = ""
//     userAvatarUrl.value = "/assets/not_logged_in.png";
//   } else {
//     myID.value = data.data.data.id;
//     userName.value = data.data.data.username;
//     if (data.data.data.avatar.length > 0) {
//       userAvatarUrl.value = data.data.data.avatar;
//     } else {
//       console.log("用户头像为空");
//       userAvatarUrl.value = "/assets/default_avatar.png";
//     }
//   }
//   const UserStore = useUserStore();
//   UserStore.setUserInfo({
//     user_id : myID.value,
//     username : userName.value,
//     avatar : userAvatarUrl.value,
//   });
//
//   localStorage.setItem('username', userName.value)
//   localStorage.setItem('avatar', userAvatarUrl.value)
// });

// 延迟关闭下拉菜单
let closeDropdownTimer = 0;
const closeDropdown = () => {
  closeDropdownTimer = 1
  setTimeout(() => {
    if (closeDropdownTimer === 1) {
      showDropdown.value = false;
    }
  }, 200);
}

// 打开下拉菜单选项
const openDropdown = () => {
  showDropdown.value = true;
  closeDropdownTimer = 0;
}

</script>

<style scoped>
.relative {
  position: relative;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 禁用input number的默认箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* 添加过渡动画 */
.nav-item {
  transition: all 0.3s ease;
}

/* 微调指示条动画 */
.nav-item::after {
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
</style>
