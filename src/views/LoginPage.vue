<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header/>
  <!-- 主要内容区 -->
    <div
        class="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      <div class="max-w-md w-full">
        <!-- Logo 展示区 -->
        <div class="flex items-center mb-10">
          <img class="h-24 w-auto mr-1" src="/assets/AcKing_black.png" alt="公司Logo" />
          <div>
            <h2 class="text-3xl font-extrabold text-gray-900">
              欢迎使用我们的服务
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              {{ isLogin ? '登录您的账户' : '创建您的新账户' }}
            </p>
          </div>
        </div>
        <!-- 登录/注册卡片 -->
        <div class="bg-white py-8 px-6 shadow rounded-lg">
          <!-- 切换标签 -->
          <div class="flex border-b border-gray-200 mb-6">
            <button
                @click="isLogin = true"
                :class="[
'py-2 px-4 text-sm font-medium focus:outline-none cursor-pointer whitespace-nowrap',
isLogin ? 'border-b-2 border-black text-gray-900' : 'text-gray-500 hover:text-gray-700'
]"
            >
              登录
            </button>
            <button
                @click="isLogin = false"
                :class="[
'py-2 px-4 text-sm font-medium focus:outline-none cursor-pointer whitespace-nowrap',
!isLogin ? 'border-b-2 border-black text-gray-900' : 'text-gray-500 hover:text-gray-700'
]"
            >
              注册
            </button>
          </div>
          <!-- 登录表单 -->
          <form v-if="isLogin" @submit.prevent="handleLogin">
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700"
              >邮箱</label
              >
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                    v-model="loginForm.email"
                    type="email"
                    id="email"
                    class="border-gray-300 focus:ring-black focus:border-black block w-full pl-10 pr-3 py-2 sm:text-sm rounded-md border"
                    placeholder="请输入您的邮箱"
                    required
                />
              </div>
            </div>
            <div class="mb-4">
              <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
              >密码</label
              >
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-lock text-gray-400"></i>
                </div>
                <input
                    v-model="loginForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    class="border-gray-300 focus:ring-black focus:border-black block w-full pl-10 pr-10 py-2 sm:text-sm rounded-md border"
                    placeholder="请输入您的密码"
                    required
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i
                      @click="showPassword = !showPassword"
                      :class="[showPassword ? 'fa-eye-slash' : 'fa-eye', 'fas text-gray-400 cursor-pointer']"
                  ></i>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <input
                    v-model="loginForm.rememberMe"
                    id="remember-me"
                    type="checkbox"
                    class="h-4 w-4 text-black focus:ring-black border-gray-300 rounded cursor-pointer"
                />
                <label
                    for="remember-me"
                    class="ml-2 block text-sm text-gray-700"
                >
                  记住我
                </label>
              </div>
              <div class="text-sm">
                <a
                    href="#"
                    class="font-medium text-gray-700 hover:text-black cursor-pointer"
                >
                  忘记密码？
                </a>
              </div>
            </div>
            <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black !rounded-button cursor-pointer whitespace-nowrap"
            >
              登录
            </button>
          </form>
          <!-- 注册表单 -->
          <form v-else @submit.prevent="handleRegister">
            <div class="mb-4">
              <label
                  for="register-name"
                  class="block text-sm font-medium text-gray-700"
              >用户名</label
              >
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-user text-gray-400"></i>
                </div>
                <input
                    v-model="registerForm.name"
                    type="text"
                    id="register-name"
                    class="border-gray-300 focus:ring-black focus:border-black block w-full pl-10 pr-3 py-2 sm:text-sm rounded-md border"
                    placeholder="请输入您的用户名"
                    required
                />
              </div>
            </div>
            <div class="mb-4">
              <label
                  for="register-email"
                  class="block text-sm font-medium text-gray-700"
              >邮箱</label
              >
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                    v-model="registerForm.email"
                    type="email"
                    id="register-email"
                    class="border-gray-300 focus:ring-black focus:border-black block w-full pl-10 pr-3 py-2 sm:text-sm rounded-md border"
                    placeholder="请输入您的邮箱"
                    required
                />
              </div>
            </div>
            <div class="mb-4">
              <label
                  for="register-password"
                  class="block text-sm font-medium text-gray-700"
              >密码</label
              >
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-lock text-gray-400"></i>
                </div>
                <input
                    v-model="registerForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    id="register-password"
                    class="border-gray-300 focus:ring-black focus:border-black block w-full pl-10 pr-10 py-2 sm:text-sm rounded-md border"
                    placeholder="请设置您的密码"
                    required
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i
                      @click="showPassword = !showPassword"
                      :class="[showPassword ? 'fa-eye-slash' : 'fa-eye', 'fas text-gray-400 cursor-pointer']"
                  ></i>
                </div>
              </div>
            </div>
            <div class="mb-4">
              <label
                  for="confirm-password"
                  class="block text-sm font-medium text-gray-700"
              >确认密码</label
              >
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-lock text-gray-400"></i>
                </div>
                <input
                    v-model="registerForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirm-password"
                    class="border-gray-300 focus:ring-black focus:border-black block w-full pl-10 pr-10 py-2 sm:text-sm rounded-md border"
                    placeholder="请再次输入密码"
                    required
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i
                      @click="showConfirmPassword = !showConfirmPassword"
                      :class="[showConfirmPassword ? 'fa-eye-slash' : 'fa-eye', 'fas text-gray-400 cursor-pointer']"
                  ></i>
                </div>
              </div>
            </div>
            <div class="flex items-center mb-6">
              <input
                  v-model="registerForm.agreeTerms"
                  id="agree-terms"
                  type="checkbox"
                  class="h-4 w-4 text-black focus:ring-black border-gray-300 rounded cursor-pointer"
                  required
              />
              <label for="agree-terms" class="ml-2 block text-sm text-gray-700">
                我已阅读并同意
                <a
                    href="#"
                    class="font-medium text-gray-700 hover:text-black cursor-pointer"
                >服务条款</a
                >
                和
                <a
                    href="#"
                    class="font-medium text-gray-700 hover:text-black cursor-pointer"
                >隐私政策</a
                >
              </label>
            </div>
            <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black !rounded-button cursor-pointer whitespace-nowrap"
            >
              注册
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Header from "@/components/Header.vue";

// Logo URL
const logoUrl =
    "https://public.readdy.ai/ai/img_res/17bd1872122269f0cd91f82d4acaac1d.jpg";


// 登录/注册切换
const isLogin = ref(true);
// 密码显示切换
const showPassword = ref(false);
const showConfirmPassword = ref(false);
// 登录表单
const loginForm = ref({
  email: "",
  password: "",
  rememberMe: false,
});
// 注册表单
const registerForm = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
});
// 登录处理
const handleLogin = () => {
  console.log("登录信息:", loginForm.value);
  // 这里添加登录逻辑
  const message = document.createElement("div");
  message.className =
      "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded";
  message.innerHTML = "登录请求已发送";
  document.body.appendChild(message);
  setTimeout(() => {
    document.body.removeChild(message);
  }, 3000);
};
// 注册处理
const handleRegister = () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    const errorMessage = document.createElement("div");
    errorMessage.className =
        "fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded";
    errorMessage.innerHTML = "两次输入的密码不一致";
    document.body.appendChild(errorMessage);
    setTimeout(() => {
      document.body.removeChild(errorMessage);
    }, 3000);
    return;
  }
  console.log("注册信息:", registerForm.value);
  // 这里添加注册逻辑
  const message = document.createElement("div");
  message.className =
      "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded";
  message.innerHTML = "注册请求已发送";
  document.body.appendChild(message);
  setTimeout(() => {
    document.body.removeChild(message);
  }, 3000);
};
</script>

<style scoped>
/* 移除 input number 的默认箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
/* 自定义样式 */
.login-form__input-wrapper {
  position: relative;
}
.login-form__icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}
</style>
