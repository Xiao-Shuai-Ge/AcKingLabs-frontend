<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <div class="max-w-6xl mx-auto pt-8 px-6 mt-14">
      <div class="bg-gradient-to-r from-gray-800 to-gray-500 rounded-lg shadow-lg mt-4 flex flex-col p-6 text-white mb-8">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="font-bold text-2xl">
              {{ contest.title }}
            </h1>
            <p class="mt-2">
              <i class="fa-regular fa-clock"></i>
              {{ formatContestTime(contest.startTime, contest.endTime) }}
            </p>
          </div>
          <div v-if="isAdmin">
            <el-button :icon="Setting" size="large" circle text @click="openSettingsDialog"/>
          </div>
        </div>
      </div>
      <!-- 题解列表 -->
      <div
          v-for="(post, index) in Posts"
          :key="index"
          class="flew flew-col w-full bg-white border border-gray-200 p-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-xl mt-4"
          @click="navigateToPost(post.ID)"
      >
        <!-- 作者信息 -->
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
        <!-- 题解标题 -->
        <div class="mb-2">
          <h1 class="font-bold text-xl">
            {{ post.Title }}
          </h1>
        </div>
        <!-- 题解内容 -->
        <p class="text-gray-400 mb-4 whitespace-pre-line text-ellipsis line-clamp-1 text-sm">
          {{ post.Content }}
        </p>
        <!-- 题解数据 -->
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
      <!-- 分页 -->
      <div v-if="totalPages == 0" class="text-center py-16">
        <i class="fas fa-calendar-times text-6xl text-gray-400 mb-4"></i>
        <div>
          <span class="text-gray-500 text-lg">当前比赛没有人提供题解，</span>
          <span class="text-blue-500 hover:text-blue-400 text-lg cursor-pointer" @click="goToCreateAnswer()">点我贡献！</span>
        </div>
      </div>
      <div v-else class="mt-8 mx-auto flex justify-center">
        <el-pagination
            :page-size="postsPerPage"
            :total="totalPages*postsPerPage"
            :pager-count="11"
            layout="prev, pager, next"
            @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
  <div class="floating-component">
    <div
        class="bg-blue-400 rounded-md shadow-lg p-4 duration-300 hover:scale-105 hover:bg-blue-500 cursor-pointer"
        @click="goToCreateAnswer()"
    >
      <i class="fas fa-add text-white text-2xl w-6 h-5"></i>
    </div>
  </div>

  <!-- 比赛设置对话框 -->
  <el-dialog
      v-model="settingsDialogVisible"
      title="比赛设置"
      width="500px"
      align-center
  >
    <div class="space-y-4">
      <!-- 精选比赛设置 -->
      <div class="flex items-center justify-between">
        <span>精选比赛</span>
        <el-switch v-model="isRecommend" />
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex space-x-2 pt-4 border-t">
        <el-button type="primary" :icon="Edit" circle @click="openEditDialog" title="编辑比赛"/>
        <el-button type="danger" :icon="Delete" circle @click="confirmDelete" title="删除比赛"/>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="settingsDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="updateRecommendSetting" :loading="recommendLoading">保存设置</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 编辑比赛对话框 -->
  <el-dialog
      v-model="editDialogVisible"
      title="编辑比赛"
      width="600px"
      align-center
  >
    <el-form :model="editForm" label-width="100px">
      <el-form-item label="比赛标题">
        <el-input v-model="editForm.title" placeholder="请输入比赛标题" />
      </el-form-item>
      <el-form-item label="比赛时间">
        <el-date-picker
            v-model="editForm.dateRange"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="比赛链接">
        <el-input v-model="editForm.url" placeholder="请输入比赛链接" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateContest" :loading="updateLoading">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 删除确认对话框 -->
  <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
      align-center
  >
    <p>确定要删除比赛 "{{ contest.title }}" 吗？此操作不可撤销。</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteContest" :loading="deleteLoading">确认删除</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import {onMounted, ref, computed} from "vue";
import {useRoute} from "vue-router";
import {get_contest, update_contest, delete_contest, set_recommend} from "@/api/contest";
import router from "@/router";
import {get_like_post, get_page_post} from "@/api/post";
import {get_user_info} from "@/api/user";
import {useUserStore} from "@/store/user";
import {CheckLevel, GetTextColor} from "@/utils/level";
import {TimestampFormat} from "@/utils/week";
import {PostTypeToColor, PostTypeToName} from "@/utils/post";
import {Edit, Delete, Setting} from "@element-plus/icons-vue";
import {useMessage} from "@/store/message";

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
const { addMessage } = useMessage()

// 管理员权限检查
const isAdmin = computed(() => {
  return UserStore.getUserInfo().role >= 3;
});

// 设置对话框相关
const settingsDialogVisible = ref(false);
const isRecommend = ref(false);
const recommendLoading = ref(false);

// 编辑对话框相关
const editDialogVisible = ref(false);
const updateLoading = ref(false);
const editForm = ref({
  title: '',
  dateRange: [] as string[],
  url: ''
});

// 删除对话框相关
const deleteDialogVisible = ref(false);
const deleteLoading = ref(false);

// 比赛数据接口
interface Contest {
  id: string;
  title: string;
  platform: string;
  startTime: number;
  endTime: number;
  duration: number;
  url: string;
  isRecommend: boolean;
}

const contest = ref<Contest>({
  id: "0",
  title: "",
  platform: "",
  startTime: 0,
  endTime: 0,
  duration: 0,
  url: "",
  isRecommend: false,
});

const route = useRoute();

// 分页相关
const currentPage = ref(1);
const postsPerPage = ref(5);
const totalPages = ref(0);

// 处理分页
const handlePageChange = (val: number) => {
  currentPage.value = val;
  Posts.value = []; // 清空帖子列表
  LoadPosts(); // 重新加载帖子列表
  console.log("当前页码:", currentPage.value);
};

const IsLoading = ref(false);
const Posts = ref<any[]>([]);

// 加载题解列表
const LoadTime = ref(0);
const LoadPosts = async () => {
  Posts.value = []; // 清空帖子列表
  LoadTime.value = new Date().getTime();
  const NowLoadTime = LoadTime.value;

  const data = await get_page_post({
    type: "solution",
    source: contest.value.url,
    page : currentPage.value,
    by : "source",
    count : postsPerPage.value,
    user_id: UserStore.getUserInfo().user_id,
  })
  console.log(data)
  if (data.data.data.length > 0) {
    // 循环加入帖子列表
    for (const post of data.data.data.posts) {
      console.log(post);
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

onMounted(async () => {
  // 获取比赛数据
  //console.log(route.params.id);
  const data = await get_contest({contest_id: route.params.id as string});
  console.log(data.data.data);
  contest.value = {
    id: data.data.data.contest.id,
    title: data.data.data.contest.title,
    platform: data.data.data.contest.platform,
    startTime: data.data.data.contest.start_time,
    endTime: data.data.data.contest.end_time,
    duration: data.data.data.contest.duration,
    url: data.data.data.contest.url,
    isRecommend: data.data.data.contest.is_recommend,
  }
  console.log(contest.value);
  // 加载题解列表
  await LoadPosts();
})

// 格式化比赛时间
const formatContestTime = (startTime: number, endTime: number) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return `${formatDate(startTime)} 至 ${formatDate(endTime)}`;
};

const formatDuration = (duration: number) => {
  const seconds = duration % 60;
  duration = Math.floor(duration / 60);
  const minutes = duration % 60;
  duration = Math.floor(duration / 60);
  const hours = duration % 24;
  duration = Math.floor(duration / 24);
  const days = duration;


  let result = "";
  if (days > 0) {
    result += `${days} 天`;
  }
  if (hours > 0) {
    result += ` ${hours} 小时`;
  }
  if (minutes > 0) {
    result += ` ${minutes} 分`;
  }
  if (seconds > 0) {
    result += ` ${seconds} 秒`;
  }
  result += " ";
  return result;
}

const goToCreateAnswer = () => {
  router.push({path: "/learn/create", query: {contest_url: contest.value.url,contest_title: contest.value.title}});
};

// 跳转到帖子详情页面
const navigateToPost = (id : string) => {
  router.push('/learn/'+id);
};

// 打开设置对话框
const openSettingsDialog = () => {
  isRecommend.value = contest.value.isRecommend;
  settingsDialogVisible.value = true;
};

// 更新精选设置
const updateRecommendSetting = async () => {
  recommendLoading.value = true;
  try {
    const data = await set_recommend({
      contest_id: contest.value.id,
      is_recommend: isRecommend.value,
    });

    if (data.data.code === 20000) {
      addMessage('设置成功', 'success');
      contest.value.isRecommend = isRecommend.value;
      settingsDialogVisible.value = false;
    } else {
      addMessage(data.data.message || '设置失败', 'error');
    }
  } catch (error) {
    addMessage('设置失败', 'error');
  } finally {
    recommendLoading.value = false;
  }
};

// 打开编辑对话框
const openEditDialog = () => {
  editForm.value = {
    title: contest.value.title,
    dateRange: [
      new Date(contest.value.startTime).toISOString().slice(0, 19).replace('T', ' '),
      new Date(contest.value.endTime).toISOString().slice(0, 19).replace('T', ' ')
    ],
    url: contest.value.url
  };
  editDialogVisible.value = true;
};

// 更新比赛
const updateContest = async () => {
  if (!editForm.value.title.trim() || !editForm.value.url.trim() || editForm.value.dateRange.length !== 2) {
    addMessage('请填写完整信息', 'error');
    return;
  }

  updateLoading.value = true;
  try {
    const data = await update_contest({
      contest_id: contest.value.id,
      title: editForm.value.title,
      start_time: new Date(editForm.value.dateRange[0]).getTime(),
      end_time: new Date(editForm.value.dateRange[1]).getTime(),
      url: editForm.value.url
    });

    if (data.data.code === 20000) {
      addMessage('更新成功', 'success');
      // 更新本地数据
      contest.value.title = editForm.value.title;
      contest.value.startTime = new Date(editForm.value.dateRange[0]).getTime();
      contest.value.endTime = new Date(editForm.value.dateRange[1]).getTime();
      contest.value.url = editForm.value.url;
      editDialogVisible.value = false;
    } else {
      addMessage(data.data.message || '更新失败', 'error');
    }
  } catch (error) {
    addMessage('更新失败', 'error');
  } finally {
    updateLoading.value = false;
  }
};

// 确认删除
const confirmDelete = () => {
  deleteDialogVisible.value = true;
};

// 删除比赛
const deleteContest = async () => {
  deleteLoading.value = true;
  try {
    const data = await delete_contest({
      contest_id: contest.value.id
    });

    if (data.data.code === 20000) {
      addMessage('删除成功', 'success');
      deleteDialogVisible.value = false;
      // 跳转到比赛列表页面
      router.push('/contest');
    } else {
      addMessage(data.data.message || '删除失败', 'error');
    }
  } catch (error) {
    addMessage('删除失败', 'error');
  } finally {
    deleteLoading.value = false;
  }
};
</script>

<style scoped>
.floating-component {
  position: fixed; /* 固定位置 */
  bottom: 5%; /* 下边距 */
  right: 5%; /* 右边距 */
  z-index: 10; /* 设置 z-index 确保悬浮在顶层 */
}
</style>