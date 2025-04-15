<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
    <Header/>
    <!-- 头部发布按钮 -->
    <div class="mb-12 mt-10">
      <button
          class="w-32 h-32 rounded-full text-white flex items-center justify-center shadow-lg  transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap hover:scale-105"
          :class="ButtonClass"
          @click="ClickButtion"

      >
        <i :class="ButtonIcon"></i>
        <span class="ml-2">{{ ButtonText }}</span>
      </button>
    </div>

    <div class="text-gray-500 text-sm mb-4">
      <p>记录学习时间: {{ GetStudyTimeString(new Date(WeekDisplayTime)).formToFormat }}</p>
      <p>有效打卡时间: {{ GetValidSubmissionTime(new Date(WeekDisplayTime)).formToFormat }}</p>

    </div>

    <!-- 周期选择区域 -->
    <div class="w-full max-w-3xl flex items-center justify-between mb-8">
      <button
          class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap"
          @click="prevWeek"
      >
        <i class="fas fa-chevron-left text-gray-700"></i>
      </button>

      <h2 class="text-xl font-medium">{{ currentWeekDisplay }}</h2>

      <button
          class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-all duration-300 cursor-pointer !rounded-button whitespace-nowrap"
          @click="nextWeek"
      >
        <i class="fas fa-chevron-right text-gray-700"></i>
      </button>
    </div>

    <!-- 周记内容展示区 -->
    <div class="w-full max-w-3xl space-y-6 mb-64">
      <!-- 排序方式选择 -->
      <div class="mb-3">
        <div class="flex gap-3">
          <button
              v-for="tab in SortTabs"
              :key="tab.id"
              @click="SelectTab(tab.id)"
              :class="[
              'px-4 py-2 rounded-xl font-medium cursor-pointer whitespace-nowrap border-2 border-gray-800',
              SelectedTab === tab.id ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
        <hr class="border-2 border-gray-800 mt-2"/>
      </div>

      <div
          v-for="(post, index) in Posts"
          :key="index"
          class=" border-2 border-gray-500 rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
          @click="navigateToPost(post.ID)"
      >
        <div class="flex items-center mb-2">
          <img
              :src="post.AuthorAvatar"
              :alt="`${post.AuthorName}的头像`"
              class="w-6 h-6 rounded-full object-cover object-top border-2 border-gray-800"
          />
          <div class="ml-2">
            <h3 class="font-bold text-base" :class="GetTextColor(post.AuthorLevel)">{{ post.AuthorName }}</h3>
          </div>
        </div>

        <div class="mt-2 mb-2 flex items-center gap-2">
          <span class="text-2xl font-bold"> {{ post.Title }} </span>
          <span class="text-gray-500 border-2 border-gray-500 rounded-md px-1 text-sm"> {{post.TypeName}} </span>
          <span v-if="post.IsPrivate" class="text-blue-500 border-2 border-blue-500 rounded-md px-1 text-sm">私密</span>
          <span v-if="post.IsFeatured" class="text-yellow-500 border-2 border-yellow-500 rounded-md px-1 text-sm">精华</span>
          <span v-if="post.IsAdminLike" class="text-red-500 border-2 border-red-500 rounded-md px-1 text-sm">管理推荐</span>
        </div>

        <p class="text-gray-400 mb-4 whitespace-pre-line text-ellipsis line-clamp-1 text-sm">
          {{ post.Content }}
        </p>

        <div class="flex items-center text-gray-500 text-sm">
          <div class="flex items-center mr-6">
            <i class="far fa-heart mr-1"
              :class="{
                'text-red-500 fas': post.IsLiked,
                'text-gary-500 far': !post.IsLiked
              }"
            ></i>
            <span>{{ post.Likes }}</span>
          </div>
          <div class="flex items-center">
            <i class="far fa-comment mr-1"></i>
            <span>{{ post.Comments }}</span>
          </div>
          <div class="flex items-center ml-auto">
            <p class="text-sm text-gray-500">{{ post.PublishDate }}</p>
          </div>
        </div>
      </div>

      <!-- 加载更多按钮 -->
      <div class="flex justify-center mt-8" v-if="HasMorePosts">
        <button
            class="px-6 py-3 border-2 border-gray-800 text-gray-800 rounded-md font-medium hover:bg-gray-100 transition-all duration-300 flex items-center cursor-pointer !rounded-button whitespace-nowrap"
            @click="LoadMorePosts(5)"
            :disabled="IsLoading"
        >
          <span v-if="!IsLoading">加载更多</span>
          <i v-else class="fas fa-spinner fa-spin mr-2"></i>
          <span v-if="IsLoading">加载中...</span>
        </button>
      </div>
      <div class="flex justify-center mt-8" v-else>
        <div>
          没有更多帖子了
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import Header from "@/components/Header.vue";
import {GetStudyTimeString, GetValidSubmissionTime, GetWeekCode, GetWeekday, TimestampFormat} from "@/utils/week";
import router from "@/router";
import {get_diary_list, get_like_post, get_more_post} from "@/api/post";
import {CheckLevel , GetTextColor} from "@/utils/level";
import {get_user_info} from "@/api/user";
import {PostTypeToName} from "@/utils/post";
import {useUserStore} from "@/store/user";

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

const WeekDisplayTime = ref(0);

const DiaryMap = new Map();

onMounted(async () => {
  // 将WeekDisplayTime时间调到这周周一,无论是周一几点都在周记提交时间范围内
  const date = new Date()
  WeekDisplayTime.value = date.getTime();
  const week = GetWeekday(date);
  if (week == 1 || (week == 2 && date.getHours() < 12)) {
    // 往回退
    WeekDisplayTime.value -= (week-1) * 24 * 60 * 60 * 1000;
  } else {
    // 往前推
    WeekDisplayTime.value += (8-week) * 24 * 60 * 60 * 1000;
  }
  // 获得个人周记列表
  const user_id = (await UserStore.getUserInfoForced()).user_id
  //console.log("用户id",user_id)
  const data2 = await get_diary_list({user_id:user_id})
  for (const diary of data2.data.data.posts) {
    DiaryMap.set(diary.source, diary.post_id)
  }
  // 刷新按钮
  RefreshButton()
})

// 计算当前周显示
const currentWeekDisplay = computed(() => {
  return GetWeekCode(new Date(WeekDisplayTime.value)).name;
});

// 排序方式
const SortTabs = [
  { id: "popular", name: "推荐" },
  { id: "new", name: "最新" },
]
const SelectedTab = ref("popular");

const ButtonText = ref("发布周记");
const ButtonIcon = ref("fas fa-plus text-xl")
const ButtonClass = ref("bg-black hover:bg-gray-800")

const RefreshButton = () => {
  const data = GetValidSubmissionTime(new Date(WeekDisplayTime.value));
  const date = new Date();
  const weekcode = GetWeekCode(new Date(WeekDisplayTime.value)).code;
  if (date < data.from) {
    ButtonText.value = "未到时间";
    ButtonIcon.value = "far fa-clock text-xl";
    ButtonClass.value = "bg-gray-500 hover:bg-gray-400";
  } else if (date > data.to) {
    if (DiaryMap.has(weekcode)) {
      ButtonText.value = "已提交";
      ButtonIcon.value = "fa-solid fa-check text-xl";
      ButtonClass.value = "bg-green-500 hover:bg-green-400";
    } else {
      ButtonText.value = "未提交";
      ButtonIcon.value = "fa-solid fa-xmark text-xl";
      ButtonClass.value = "bg-red-500 hover:bg-red-400";
    }
  } else {
    if (DiaryMap.has(weekcode)) {
      ButtonText.value = "已提交";
      ButtonIcon.value = "fa-solid fa-check text-xl";
      ButtonClass.value = "bg-green-500 hover:bg-green-400";
    } else {
      ButtonText.value = "发布周记";
      ButtonIcon.value = "fas fa-plus text-xl";
      ButtonClass.value = "bg-black hover:bg-gray-800";
    }
  }
}

// 跳转到发布页面
const ClickButtion = () => {
  const data = GetValidSubmissionTime(new Date(WeekDisplayTime.value));
  const date = new Date();
  const weekcode = GetWeekCode(new Date(WeekDisplayTime.value)).code;
  // 已提交，可以查看
  if (DiaryMap.has(weekcode)) {
    router.push(`/diary/`+DiaryMap.get(weekcode));
  } else if (date >= data.from && date <= data.to) {
    router.push('/diary/create');
  }
};

const RefreshPostList = () => {
  BeforeID.value = "9223372036854775807"
  Posts.value = []
  PostMAP.clear();
  UserMap.clear();
  HasMorePosts.value = true;
  LoadMorePosts(5);
}

// 选择排序方式
const SelectTab = (id : string) => {
  SelectedTab.value = id;
  RefreshPostList()
}

let BeforeID = ref("9223372036854775807")

onMounted(async () => {
  SelectedTab.value = "popular";
  await LoadMorePosts(5);
})

const IsLoading = ref(false);
const Posts = ref<any[]>([]);
const HasMorePosts = ref(true);

const PostMAP = new Map<string,boolean>();

// 加载更多周记
const LoadTime = ref(0);
const LoadMorePosts = async (count:number) => {
  LoadTime.value = new Date().getTime();
  const NowLoadTime = LoadTime.value;

  const data = await get_more_post({
    type: "diary",
    source: GetWeekCode(new Date(WeekDisplayTime.value)).code,
    before_id: BeforeID.value,
    by : SelectedTab.value,
    count : count
  })
  //console.log(data)
  if (data.data.data.length > 0) {
    // 循环加入帖子列表
    for (const post of data.data.data.posts) {
      //console.log(post);
      if (!PostMAP.has(post.id)) {
        PostMAP.set(post.id, true);
        const Author = await getUserInfo(post.user_id);
        const isLiked = await get_like_post({post_id: post.id});
        if (LoadTime.value != NowLoadTime) {
          // 不再加载此次数据，退出循环
          break;
        }
        //console.log(isLiked);
        Posts.value.push({
          ID : post.id,
          AuthorID : post.user_id,
          AuthorName: Author.username,
          AuthorAvatar: Author.avatar,
          AuthorXp: Author.xp,
          AuthorLevel: Author.level,
          PublishTime: post.created_at,
          PublishDate: TimestampFormat(new Date(post.created_at)),

          TypeName: PostTypeToName(post.type),
          Title: post.title,
          Content: post.content_short,
          Likes: post.likes,
          Comments: post.comments,

          IsAdminLike: post.is_admin_like,
          IsFeatured: post.is_featured,
          IsPrivate: post.is_private,

          IsLiked: isLiked.data.data.is_like,
          Source: post.source,
          Weight: post.weight,
        });
        if (SelectedTab.value === "popular") {
          BeforeID.value = post.weight
        } else {
          BeforeID.value = post.id
        }
      }
    }
  }
  IsLoading.value = false;
  if (data.data.data.length < count ) {
    HasMorePosts.value = false;
  }
}

// 切换周次
const prevWeek = () => {
  WeekDisplayTime.value -= 7 * 24 * 60 * 60 * 1000;
  RefreshButton()
  RefreshPostList()
}

const nextWeek = () => {
  WeekDisplayTime.value += 7 * 24 * 60 * 60 * 1000;
  RefreshButton()
  RefreshPostList()
}

// 跳转到帖子详情页面
const navigateToPost = (id : string) => {
  router.push('/diary/'+id);
};

</script>

<style scoped>
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
