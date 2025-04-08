<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header/>
  <!-- 主要内容区 -->
    <div
        class="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      <div class="max-w-md w-full">
        <!-- 登录/注册卡片 -->
        <div class="bg-white py-8 px-6 shadow rounded-lg overflow-hidden">
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
          <!-- 添加过渡容器 -->
          <Transition name="slide-fade" mode="out-in">
            <!-- 登录表单 -->
            <form v-if="isLogin" @submit.prevent="handleLogin" key="login">
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
            <form v-else @submit.prevent="handleRegister" key="register">
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
                      v-model="registerForm.username"
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
                    for="verification-code"
                    class="block text-sm font-medium text-gray-700"
                >验证码</label
                >
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <i class="fas fa-shield-alt text-gray-400"></i>
                  </div>
                  <input
                      v-model="registerForm.verificationCode"
                      type="text"
                      id="verification-code"
                      class="border-gray-300 focus:ring-black focus:border-black block w-full pl-10 pr-24 py-2 sm:text-sm rounded-md border"
                      placeholder="请输入验证码"
                      required
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-1">
                    <button
                        type="button"
                        @click="sendVerificationCode"
                        :disabled="isSending || countdown > 0"
                        class="h-8 px-3 text-sm font-medium text-white bg-black rounded-md transition-colors"
                        :class="(isSending || countdown > 0) ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-gray-800'"
                    >
                      {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
                    </button>
                  </div>
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
                      :class = "(registerForm.password != registerForm.confirmPassword)? 'border-red-500':''"
                  />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <i
                        @click="showConfirmPassword = !showConfirmPassword"
                        :class="[showConfirmPassword ? 'fa-eye-slash' : 'fa-eye', 'fas text-gray-400 cursor-pointer']"
                    ></i>
                  </div>
                </div>
              </div>
              <button
                  type="submit"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black !rounded-button cursor-pointer whitespace-nowrap"
              >
                注册
              </button>
            </form>
          </Transition>
          <div class="text-red-500 text-center mt-2">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import Header from "@/components/Header.vue";
import {login, register, send_code} from "@/api/auth";

// 显示提示信息
let message = ref("")

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
  username: "",
  email: "",
  verificationCode: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
});

// 登录处理
const handleLogin = async () => {
  // 检查密码长度
  if (loginForm.value.password.length < 6 || loginForm.value.password.length > 30) {
    message.value = "密码长度应在 6 到 30 之间"
    return
  }
  message.value = ""
  const data = await login({
    email: loginForm.value.email,
    password: loginForm.value.password,
    is_remember : loginForm.value.rememberMe,
  })
  console.log(data)
  if (data.data.code === 10009) {
    // 账号密码错误
    message.value = "账号或密码错误"
  }
  localStorage.setItem('atoken', data.data.data.atoken)
  localStorage.setItem('rtoken', data.data.data.rtoken)
  // 跳转到主页
  window.location.href = '/'
};

// 注册处理
const handleRegister = async () => {
  // 确认密码
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    message.value = "密码不一致！";
    return
  }
  // 密码长度
  if (registerForm.value.password.length < 6 || registerForm.value.password.length > 30) {
    message.value = "密码长度应在 6 到 30 之间"
    return
  }
  // 用户名长度
  if (registerForm.value.username.length > 30) {
    message.value = "用户名长度不应超过 30"
    return
  }
  // 发送请求
  const data = await register({
    email: registerForm.value.email,
    password: registerForm.value.password,
    username: registerForm.value.username,
    code: registerForm.value.verificationCode,
  })
  console.log(data)
  if (data.data.code === 10008) {
    // 验证码错误
    message.value = "验证码错误"
    return
  } else if (data.data.code === 10010) {
    // 邮箱已被注册
    message.value = "邮箱已被使用"
    return
  } else if (data.data.code != 20000) {
    message.value = "发生错误"
    return
  }
  localStorage.setItem('atoken', data.data.data.atoken)
  // 跳转到主页
  window.location.href = '/'
};

// 发送验证码
const isSending = ref(false);
const countdown = ref(0);
const sendVerificationCode = async () => {
  console.log("发送验证码")
  const data = await send_code({email: registerForm.value.email})
  console.log(data)
  if (data.data.code != 20000) {
    message.value = "发生错误"
    return
  }
  message.value = ""
  console.log("发送成功")
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

onMounted( () => {
  console.log("test");
})


</script>

<style scoped>
/* 添加过渡动画 */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

/* 保持容器高度过渡流畅 */
.form-container {
  transition: height 0.3s ease-in-out;
}

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
