<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <Header/>
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- 筛选区域 -->
      <div class="mb-8 bg-white p-6 rounded-lg shadow-md ">
        <!-- 搜索栏 -->
        <div class="mb-4">
          <h3 class="text-sm font-medium text-gray-500 mb-3">搜索
            <span class="text-xs text-gray-400">(不支持类型筛选和排序方式)</span>
          </h3>
          <div class="flex">
            <el-input
                v-model="input"
                style="width: 240px"
                placeholder="请输入要搜索的关键词"
                :prefix-icon="Search"
            />
            <el-button
                class="ml-2"
                type="primary"
                @click="search"
            >搜索</el-button>
          </div>


        </div>

        <!-- 帖子类型筛选 -->
        <div class="mb-4">
          <h3 class="text-sm font-medium text-gray-500 mb-3">帖子类型</h3>
          <div class="flex flex-wrap gap-2 ">
            <button
                v-for="type in postTypes"
                :key="type.id"
                @click="selectPostType(type.id)"
                :class="[
                'px-4 py-2 rounded-button text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap',
                selectedPostType === type.id ? 'bg-black text-white' : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
              ]"
            >
              {{ type.name }}
            </button>
          </div>
        </div>

        <!-- 排序方式筛选 -->
        <div>
          <h3 class="text-sm font-medium text-gray-500 mb-3">排序方式</h3>
          <div class="flex flex-wrap gap-2">
            <button
                v-for="sort in sortOptions"
                :key="sort.id"
                @click="selectSortOption(sort.id)"
                :class="[
                'px-4 py-2 rounded-button text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap',
                selectedSortOption === sort.id ? 'bg-black text-white' : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
              ]"
            >
              {{ sort.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- 帖子列表 -->
      <div class="flex flex-col gap-3">
        <div
            v-for="(post, index) in Posts"
            :key="index"
            class="animation-delay bg-white border border-gray-200 rounded-lg p-2 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            @click="navigateToPost(post.ID)"
            :style="{ animationDelay: `${index * 0.1}s` }"
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
            <span class="border-2 rounded-md px-1 text-sm" :class="post.TypeColor"> {{post.TypeName}} </span>
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
      </div>
      <!-- 分页 -->
      <div class="mt-8 mx-auto flex justify-center">
        <el-pagination
            :page-size="postsPerPage"
            :total="totalPages*postsPerPage"
            :pager-count="11"
            layout="prev, pager, next"
            @current-change="handlePageChange"
        />
      </div>
    </div>
    <div class="floating-component">
      <div
          class="bg-blue-400 rounded-md shadow-lg p-4 duration-300 hover:scale-105 hover:bg-blue-500 cursor-pointer"
          @click="navigateTo('/learn/create')"
      >
        <i class="fas fa-add text-white text-2xl w-6 h-5"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted} from "vue";
import Header from "@/components/Header.vue";
import router from "@/router";
import {CheckLevel, GetTextColor} from "@/utils/level";
import {get_user_info} from "@/api/user";
import {useUserStore} from "@/store/user";
import {get_like_post, get_more_post, get_page_post, search_post} from "@/api/post";
import {GetWeekCode, TimestampFormat} from "@/utils/week";
import {PostTypeToColor, PostTypeToName} from "@/utils/post";
import {Search} from "@element-plus/icons-vue";

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

// 搜索输入框
const input = ref("");

const search = () => {
  // 初始化帖子类型 和 排序方式
  selectedPostType.value = "post";
  selectedSortOption.value = "popular";
  // 重置分页
  currentPage.value = 1;
  // 清空帖子列表
  Posts.value = [];

  LoadPosts(); // 重新加载帖子列表
}

// 帖子类型
const postTypes = [
  { id: "post", name: "全部" },
  { id: "official", name: "官方" },
  { id: "tutorial", name: "教程" },
  { id: "solution", name: "题解" },
  { id: "contest", name: "比赛" },
  { id: "help", name: "求助" },
  { id: "fun", name: "闲聊" },
];

// 排序选项
const sortOptions = [
  { id: "popular", name: "热度" },
  { id: "new", name: "时间" },
  { id: "featured", name: "精华" },
];

// 分页相关
const currentPage = ref(1);
const postsPerPage = ref(5);
const totalPages = ref(6);

const IsLoading = ref(false);
const Posts = ref<any[]>([]);

const PostMAP = new Map<string,boolean>();

onMounted(async () => {
  await LoadPosts();
})

// 当前选中的筛选条件
const selectedPostType = ref("post");
const selectedSortOption = ref("popular");

// 加载帖子列表
const LoadTime = ref(0);
const LoadPosts = async () => {
  LoadTime.value = new Date().getTime();
  const NowLoadTime = LoadTime.value;

  let data;
  if (input.value.length == 0) {
    data = await get_page_post({
      type: selectedPostType.value,
      user_id: "",
      source: "",
      page : currentPage.value,
      by : selectedSortOption.value,
      count : postsPerPage.value,
    })
  } else {
    data = await search_post({
      keyword: input.value,
      page : currentPage.value,
      count : postsPerPage.value,
    })
  }
  console.log(data)
  if (data.data.data.length > 0) {
    // 循环加入帖子列表
    for (const post of data.data.data.posts) {
      console.log(post);
      PostMAP.set(post.id, true);
      const Author = await getUserInfo(post.user_id);
      const isLiked = await get_like_post({post_id: post.id});
      if (LoadTime.value != NowLoadTime) {
        // 不再加载此次数据，退出循环
        break;
      }
      //console.log(isLiked);
      Posts.value.push({
        ID: post.id,
        AuthorID: post.user_id,
        AuthorName: Author.username,
        AuthorAvatar: Author.avatar,
        AuthorXp: Author.xp,
        AuthorLevel: Author.level,
        PublishTime: post.created_at,
        PublishDate: TimestampFormat(new Date(post.created_at)),

        TypeColor: PostTypeToColor(post.type),
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
    }
  }
  totalPages.value = data.data.data.page_total
  IsLoading.value = false;
}

// 选择帖子类型
const selectPostType = (typeId: string) => {
  selectedPostType.value = typeId;
  input.value = ""; // 清空搜索框
  currentPage.value = 1; // 重置到第一页
  Posts.value = []; // 清空帖子列表
  LoadPosts(); // 重新加载帖子列表
};

// 选择排序方式
const selectSortOption = (sortId: string) => {
  selectedSortOption.value = sortId;
  input.value = ""; // 清空搜索框
  currentPage.value = 1; // 重置到第一页
  Posts.value = []; // 清空帖子列表
  LoadPosts(); // 重新加载帖子列表
};


// 处理分页
const handlePageChange = (val: number) => {
  currentPage.value = val;
  Posts.value = []; // 清空帖子列表
  LoadPosts(); // 重新加载帖子列表
  console.log("当前页码:", currentPage.value);
};

// 获取类型名称
const getTypeName = (typeId: string) => {
  const type = postTypes.find((t) => t.id === typeId);
  return type ? type.name : "";
};

// 获取类型样式
const getTypeClass = (typeId: string) => {
  switch (typeId) {
    case "tutorial":
      return "bg-blue-100 text-blue-800";
    case "solution":
      return "bg-green-100 text-green-800";
    case "chat":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};


const navigateTo = (url : string) => {
  router.push(url);
};

// 跳转到帖子详情页面
const navigateToPost = (id : string) => {
  router.push('/learn/'+id);
};

</script>

<style scoped>
/* 防止数字输入框的上下箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* 多行文本截断 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


.floating-component {
  position: fixed; /* 固定位置 */
  bottom: 5%; /* 下边距 */
  right: 5%; /* 右边距 */
  z-index: 10000; /* 设置 z-index 确保悬浮在顶层 */
}

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
