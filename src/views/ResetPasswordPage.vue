<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header/>
    <!-- 主要内容区 -->
    <div
        class="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12"
    >
      <div class="max-w-md w-full">
        <!-- 找回密码卡片 -->
        <div class="bg-white py-8 px-6 shadow rounded-lg overflow-hidden">
          <!-- 标题 -->
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">找回密码</h2>
            <p class="text-sm text-gray-600 mt-2">请输入您的邮箱和验证码来重置密码</p>
          </div>

          <!-- 找回密码表单 -->
          <form @submit.prevent="handleResetPassword">
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700">邮箱</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                    v-model="resetForm.email"
                    type="email"
                    id="email"
                    class="border-gray-300 focus:ring-black focus:border-black block w-full pl-10 pr-3 py-2 sm:text-sm rounded-md border"
                    placeholder="请输入您的邮箱"
                    required
                />
              </div>
            </div>

            <div class="mb-4">
              <label for="verification-code" class="block text-sm font-medium text-gray-700">验证码</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-shield-alt text-gray-400"></i>
                </div>
                <input
                    v-model="resetForm.verificationCode"
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
              <label for="password" class="block text-sm font-medium text-gray-700">新密码</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-lock text-gray-400"></i>
                </div>
                <input
                    v-model="resetForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    class="border-gray-300 focus:ring-black focus:border-black block w-full pl-10 pr-10 py-2 sm:text-sm rounded-md border"
                    placeholder="请设置您的新密码"
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

            <div class="mb-6">
              <label for="confirm-password" class="block text-sm font-medium text-gray-700">确认新密码</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-lock text-gray-400"></i>
                </div>
                <input
                    v-model="resetForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirm-password"
                    class="border-gray-300 focus:ring-black focus:border-black block w-full pl-10 pr-10 py-2 sm:text-sm rounded-md border"
                    placeholder="请再次输入新密码"
                    required
                    :class="(resetForm.password !== resetForm.confirmPassword && resetForm.confirmPassword) ? 'border-red-500' : ''"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i
                      @click="showConfirmPassword = !showConfirmPassword"
                      :class="[showConfirmPassword ? 'fa-eye-slash' : 'fa-eye', 'fas text-gray-400 cursor-pointer']"
                  ></i>
                </div>
              </div>
              <div v-if="resetForm.password !== resetForm.confirmPassword && resetForm.confirmPassword" class="text-red-500 text-sm mt-1">
                密码不一致
              </div>
            </div>

            <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black !rounded-button cursor-pointer whitespace-nowrap"
            >
              重置密码
            </button>

            <!-- 返回登录链接 -->
            <div class="text-center mt-4">
              <router-link
                  to="/login"
                  class="text-sm text-gray-600 hover:text-black cursor-pointer"
              >
                <i class="fas fa-arrow-left mr-1"></i>
                返回登录
              </router-link>
            </div>
          </form>

          <!-- 错误信息显示 -->
          <div class="text-red-500 text-center mt-2">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Header from "@/components/Header.vue";
import { resetPassword, send_code } from "@/api/auth";
import { useRouter } from "vue-router";

const router = useRouter();

// 显示提示信息
let message = ref("")

// 密码显示切换
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 找回密码表单
const resetForm = ref({
  email: "",
  verificationCode: "",
  password: "",
  confirmPassword: "",
});

// 发送验证码相关
const isSending = ref(false);
const countdown = ref(0);

// 发送验证码
const sendVerificationCode = async () => {
  if (!resetForm.value.email) {
    message.value = "请先输入邮箱";
    return;
  }
  
  console.log("发送验证码");
  const data = await send_code({ email: resetForm.value.email });
  console.log(data);
  
  if (data.data.code != 20000) {
    message.value = data.data.message || "发送验证码失败";
    return;
  }
  
  message.value = "验证码已发送，请查收邮箱";
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

// 重置密码处理
const handleResetPassword = async () => {
  // 验证密码一致性
  if (resetForm.value.password !== resetForm.value.confirmPassword) {
    message.value = "密码不一致！";
    return;
  }
  
  // 验证密码长度
  if (resetForm.value.password.length < 6 || resetForm.value.password.length > 30) {
    message.value = "密码长度应在 6 到 30 之间";
    return;
  }
  
  // 验证邮箱格式
  if (!resetForm.value.email) {
    message.value = "请输入邮箱";
    return;
  }
  
  // 验证验证码
  if (!resetForm.value.verificationCode) {
    message.value = "请输入验证码";
    return;
  }
  
  message.value = "";
  
  try {
    const data = await resetPassword({
      email: resetForm.value.email,
      code: resetForm.value.verificationCode,
      password: resetForm.value.password,
    });
    
    console.log(data);
    
    if (data.data.code === 20000) {
      message.value = "密码重置成功，请使用新密码登录";
      // 延迟跳转到登录页面
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      message.value = data.data.message || "重置密码失败";
    }
  } catch (error) {
    console.error("重置密码失败:", error);
    message.value = "重置密码失败，请稍后重试";
  }
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
  appearance: textfield;
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
