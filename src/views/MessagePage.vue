<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
    <Header/>
    <div class="w-full max-w-3xl">
      <div class="flex items-center justify-center mt-10 text-3xl text-bold text-gray-800">
        <i class="fas fa-bell mr-2"></i>
        <h1> 消息中心 </h1>
      </div>

      <!-- 选择类型 -->
      <div>
        <div>
          <button
              v-for="tab in TypeTabs"
              :key="tab.id"
              @click="SelectTab(tab.id)"
              :class="[
              'px-6 py-3 font-medium cursor-pointer whitespace-nowrap',
              SelectedTab === tab.id ? 'bg-gray-800 text-white' : 'text-gray-800 hover:bg-gray-100'
            ]"
          >
            {{ tab.name }}
            <span v-if="GetMessageCount(tab) > 0"
              class="rounded-full text-xs min-w-[18px] h-[18px] items-center justify-center px-1"
              :class="[SelectedTab === tab.id ? 'bg-white text-gray-800' : 'bg-red-500 text-white']"
            >
              {{ GetMessageCount(tab) }}
            </span>
          </button>
        </div>
      </div>
      <!-- 信息框 -->
      <div class="min-h-[30px] max-h-[400px] border-2 border-gray-800 mb-6 bg-gray-100 overflow-y-scroll">
        <div
          v-for="message in Messages"
          @mouseenter="markRead(message)"
          class="px-2 py-2 border-b border-gray-800 bg-white flexhover:bg-gray-200"
        >
          <!-- 发送者 -->
          <div v-if="message.SenderID != '' && message.SenderID != '0'"
              class="flex items-center mr-4 cursor-pointer mb-2 "
              @click="navigateTo('/profile/'+message.SenderID)"
          >
            <img
                :src="message.SenderAvatar"
                :alt="`${message.SenderName}的头像`"
                class="w-6 h-6 rounded-full object-cover object-top border-2 border-gray-800"
            />
            <div class="ml-2">
              <h3 class="font-bold text-base hover:underline" :class="GetTextColor(message.SenderLevel)">{{ message.SenderName }}</h3>
            </div>
            <!-- 时间 -->
            <div class="ml-auto text-xs text-gray-500">
              {{ message.CreateAtFormat }}
            </div>
            <!-- 已读 -->
            <div v-if="!message.IsRead" class="ml-4 text-xs text-gray-500">
              <i class="fas fa-circle text-red-500"></i>
            </div>
          </div>
          <!-- <div v-else class="flex">
            <div class="bg-gray-800 text-white px-2 py-1 rounded-md">系统</div>
          </div> -->
          <div
              :class="{ 'hover:underline cursor-pointer' : message.Url }"
               @click="navigateTo(message.Url)"
          >
            {{ message.Content }}
          </div>
        </div>
        <div v-if="Messages?.length === 0" class="flex justify-center items-center h-full">
          (暂无消息)
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import {computed, onMounted, ref} from "vue";
import {get_message_count, get_message_list, mark_message_read} from "@/api/message";
import { useMessage } from '@/store/message'
import router from "@/router";
import {upload_image} from "@/api/file";
import {useUserStore} from "@/store/user";
import {CheckLevel, GetTextColor} from "@/utils/level";
import {get_user_info} from "@/api/user";
import {TimestampFormat} from "@/utils/week";
const { addMessage } = useMessage()

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

const UserStore = useUserStore()

onMounted( async () => {
  const data = await get_message_count();
  if (data.data.code != 20000) {
    addMessage(data.data.message || "获取消息数量失败", "error")
    return
  }
  SystemCount.value = data.data.data.system_count;
  LikeCount.value = data.data.data.like_count;
  CommentCount.value = data.data.data.comment_count;

  await GetMessageList()
})

// 信息类型
const TypeTabs = [
  { id: "system", name: "系统" },
  { id: "like", name: "点赞" },
  { id: "comment", name: "评论" }
]
const SelectedTab = ref("system");

// 选择排序方式
const SelectTab = (id : string) => {
  SelectedTab.value = id;
  //RefreshPostList()
}

interface Message {
  ID : string;
  Type : string;
  CreateAt : number;
  CreateAtFormat : string;
  Content : string;
  Url : string;
  IsRead : boolean;

  SenderID : string;
  SenderName : string;
  SenderAvatar : string;
  SenderLevel : number;
}

const SystemMessages = ref<Message[]>([]);
const LikeMessages = ref<Message[]>([]);
const CommentMessages = ref<Message[]>([]);

const Messages = computed(() => {
  if (SelectedTab.value === "system") {
    return SystemMessages.value;
  } else if (SelectedTab.value === "like") {
    return LikeMessages.value;
  } else if (SelectedTab.value === "comment") {
    return CommentMessages.value;
  }
})

const SystemCount = ref(0);
const LikeCount = ref(0);
const CommentCount = ref(0);

const GetMessageCount = (tab : {id:string,name:string}) => {
  if (tab.id === "system") {
    return SystemCount.value;
  } else if (tab.id === "like") {
    return LikeCount.value;
  } else if (tab.id === "comment") {
    return CommentCount.value;
  }
  return 0
}


// 获取信息列表
const GetMessageList = async () => {
  for (let item of TypeTabs) {
    const data = await get_message_list({ type: item.id });
    if (data.data.code != 20000) {
      addMessage(data.data.message || "获取消息列表失败", "error")
      return
    }
    console.log(data.data.data);
    if (data.data.data.length === 0) {
      continue;
    }
    for (let messageResp of data.data.data.messages) {
      let userInfo : UserInfo
      if (messageResp.sender_id != "" && messageResp.sender_id != "0") {
        userInfo = await getUserInfo(messageResp.sender_id);
      } else {
        // 留空
        userInfo = {
          username: "",
          avatar: "",
          role: 0,
          xp: 0,
          level: 0,
        }
      }
      const message : Message = {
        ID: messageResp.id,
        Type: messageResp.type,
        CreateAt: messageResp.created_at,
        CreateAtFormat: TimestampFormat(new Date(messageResp.created_at)),
        Content: messageResp.content,
        Url: messageResp.url,
        IsRead: messageResp.is_read,

        SenderID: messageResp.sender_id,
        SenderName: userInfo.username,
        SenderAvatar: userInfo.avatar,
        SenderLevel: userInfo.level,
      }
      if (item.id === "system") {
        SystemMessages.value.push(message)
      } else if (item.id === "like") {
        LikeMessages.value.push(message)
      } else if (item.id === "comment") {
        CommentMessages.value.push(message)
      }
    }
  }
}

const markRead = async (message : Message) => {
  if (message.IsRead) {
    return;
  }
  message.IsRead = true;
  if (message.Type === "system") {
    SystemCount.value -= 1;
  } else if (message.Type === "like") {
    LikeCount.value -= 1;
  } else if (message.Type === "comment") {
    CommentCount.value -= 1;
  }

  const data = await mark_message_read({message_id: message.ID})
  if (data.data.code != 20000) {
    addMessage(data.data.message || "标记已读失败", "error");
    return;
  }
}

const navigateTo = async (url: string) => {
  await router.push(url);
}

</script>

<style scoped>

</style>