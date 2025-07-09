<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <Header />
    <div
        class="w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
    >
      <!-- 聊天头部 -->
      <div class="bg-gray-800 text-white p-4 flex items-center">
        <div
            class="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3"
        >
          <i class="fas fa-comments text-lg text-gray-800"></i>
        </div>
        <div>
          <h2 class="text-lg font-semibold">聊天室</h2>
          <div class="flex">
            <p class="text-blue-100 text-sm">连接状态:</p>
            <div v-if="connectionStatus" class="text-green-500 text-sm">已连接</div>
            <div v-else class="text-red-500 text-sm">已断开</div>
          </div>
        </div>
      </div>
      <!-- 聊天消息区域 -->
      <div
          ref="messageContainer"
          class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          style="height: calc(75% - 80px)"
      >
        <div
            v-for="message in messages"
            :key="message.id"
            :class="[
'flex items-start space-x-3',
message.isOwn ? 'flex-row-reverse space-x-reverse' : ''
]"
        >
          <!-- 头像 -->
          <div class="flex-shrink-0">
            <img
                :src="message.avatar"
                :alt="message.username"
                class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          </div>
          <!-- 消息内容 -->
          <div
              :class="['max-w-xs lg:max-w-md', message.isOwn ? 'text-right' : '']"
          >
            <!-- 用户名 -->
            <div
                :class="['text-sm font-medium mb-1', message.isOwn ? 'text-blue-600' : 'text-gray-600']"
            >
              {{ message.username }}
            </div>
            <!-- 消息气泡 -->
            <div
                :class="[
'inline-block px-4 py-2 rounded-2xl shadow-sm',
message.isOwn
? 'bg-blue-500 text-white rounded-br-md'
: 'bg-white text-gray-800 rounded-bl-md border'
]"
            >
              <p class="text-sm leading-relaxed">{{ message.content }}</p>
            </div>
            <!-- 发送时间 -->
            <div
                :class="['text-xs text-gray-400 mt-1', message.isOwn ? 'text-right' : '']"
            >
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>
      </div>
      <!-- 发送消息区域 -->
      <div class="bg-white border-t border-gray-200 p-4">
        <!-- 功能按钮 -->
        <div class="flex items-center space-x-2 mb-3">
          <button
              class="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <i class="fas fa-smile text-lg"></i>
          </button>
          <button
              class="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <i class="fas fa-image text-lg"></i>
          </button>
          <button
              class="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <i class="fas fa-paperclip text-lg"></i>
          </button>
        </div>
        <!-- 输入区域 -->
        <div class="flex items-end space-x-3">
          <div class="flex-1">
            <textarea
                v-model="newMessage"
                @keydown.enter.prevent="handleEnterKey"
                placeholder="输入消息..."
                class="w-full p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows="2"
                :disabled="isLoading"
            ></textarea>
          </div>
          <button
              @click="sendMessage"
              :disabled="!newMessage.trim() || isLoading"
              :class="[
'px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap !rounded-button cursor-pointer',
newMessage.trim() && !isLoading
? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
: 'bg-gray-300 text-gray-500 cursor-not-allowed'
]"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-paper-plane mr-2"></i>
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, nextTick, onMounted, onBeforeUnmount, onDeactivated} from "vue";
import Header from "@/components/Header.vue";
import { config } from '@/config.js'
import {useUserStore} from "@/store/user";
import {get_user_info} from "@/api/user";
import {CheckLevel} from "@/utils/level";

// 用户信息缓存--------------------------------------------------------
let UserMap = new Map();

interface UserInfo {
  username: string;
  avatar: string;
  role : number;
  xp : number;
  level : number;
}

const getUserInfo = async (id : string) : Promise<UserInfo> => {
  let data = UserMap.get(id)
  if (!data) {
    // 不存在，异步请求用户信息
    const resp = await get_user_info({id:id})
    data = resp.data.data
    data.level = CheckLevel(data.xp,data.role);
    UserMap.set(id, data)
    console.log("缓存用户信息",data)
  }
  return data
}
//-------------------------------------------------------------------

const UserStore = useUserStore();

// websocket
const socket = new WebSocket(config.BACKEND_URL+ '/ws?token=Bearer '+ UserStore.getAtoken());

const connectionStatus = ref(0);

onMounted(() => {
  socket.onopen = function(event) {
    console.log('WebSocket连接已打开');
    connectionStatus.value = 1;
  };

  socket.onmessage = function(event) {
    //console.log('接收到消息：', event.data);
    handleWebSocketMessage(event);
  };

  socket.onclose = function(event) {
    console.log('WebSocket连接已关闭');
    connectionStatus.value = 0; // 连接已关闭
  };

  socket.onerror = function(event) {
    console.error('WebSocket连接出错', event);
    connectionStatus.value = 0; // 出错时也认为连接已断开
  };
})

const handleWebSocketMessage = async (event: MessageEvent) => {
  console.log('接收到消息：', event.data);
  const data = JSON.parse(event.data);
  if (data.type && data.type === "chat") {
    if (messagesMap.has(data.id)) {
      return;
    }
    // 获取用户信息
    const userInfo = await getUserInfo(data.user_id)
    // 解析消息
    const message = {
      id: data.id,
      user_id: data.user_id,
      username: userInfo.username,
      content: data.content,
      timestamp: data.timestamp,
      isOwn: data.user_id === UserStore.getUserInfo().user_id,
      avatar: userInfo.avatar,
    };
    console.log("解析出消息：", data)
    messagesMap.set(data.id, true);
    messages.value.push(message);

    // 判断是否需要自动滚动到底部
    if (messageContainer.value) {
      const isAtBottom =
          messageContainer.value.scrollTop +
          messageContainer.value.clientHeight >=
          messageContainer.value.scrollHeight - 10; // 允许一定的误差范围
      if (isAtBottom) {
        scrollToBottom();
      }
    }
  }
}

onDeactivated(() => {
  socket.onclose = function(event) {
    console.log('WebSocket连接已关闭');
  };
})

interface Message {
  id: number;
  user_id: string;
  username: string;
  content: string;
  timestamp: number;
  isOwn: boolean;
  avatar: string;
}
const messageContainer = ref<HTMLElement>();
const newMessage = ref("");
const isLoading = ref(false);

const messagesMap = new Map<number, boolean>();

const messages = ref<Message[]>([]);


const formatTime = (timestamp: number): string => {
  console.log(new Date(timestamp))
  const now = new Date().getTime();
  const diff = now - timestamp;
  if (diff < 60000) {
    return "刚刚";
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`;
  } else {
    return new Date(timestamp).toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  // 打包信息json
  const content = {
    type: "all",
    content: newMessage.value,
  }
  const contentJson = JSON.stringify(content);
  // 打包外层json
  const data = {
    type: "chat",
    content: contentJson,
  }
  const dataJson = JSON.stringify(data);
  // 发送消息
  socket.send(dataJson);

  newMessage.value = "";
  await scrollToBottom();
};

const handleEnterKey = (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    sendMessage();
  }
};
onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.\!rounded-button {
  border-radius: 12px !important;
}
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
/* 输入框焦点样式 */
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
/* 消息动画 */
.message-enter-active {
  transition: all 0.3s ease;
}
.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
