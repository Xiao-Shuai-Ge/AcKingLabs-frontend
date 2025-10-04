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
      <div class="text-center">
        <div v-if="editMode" class="mb-2">
          <el-input
              v-model="editForm.username"
              placeholder="请输入用户名"
              maxlength="20"
              minlength="0"
          ></el-input>
        </div>
        <h1 v-else class="text-3xl font-bold mb-2" :class = GetTextColor(userInfo.level) >{{ userInfo.username }}</h1>
        
        <!-- 个性签名 -->
        <div v-if="editMode" class="mb-6">
          <el-input
              v-model="editForm.signature"
              placeholder="写下你的个性签名..."
              maxlength="200"
          ></el-input>
        </div>
        <p v-else class="text-gray-500 italic text-sm mb-6">{{ userInfo.signature || '此人很懒什么也没写' }}</p>
      </div>

      <div class="w-full m-2 flex justify-end">
        <div v-if="editMode">
          <el-button
              plain
              @click="editMode = false"
          >取消</el-button>
          <el-button
              type="success"
              plain
              @click="saveUserInfo"
          >
            保存
          </el-button>
        </div>
        <div v-else-if="isCanEdit">
          <el-button
              type="primary"
              @click="openEditMode()"
              plain
          >编辑</el-button>
        </div>
      </div>
      <!-- 个人详细信息卡片 -->
      <div
          class="w-full bg-white border-2 border-gray-800 rounded-lg p-6 shadow-lg"
      >
        <div class="mb-6">
          <div class="flex">
            <p class="text-sm text-gray-600 mb-1">经验值(目前身份：</p>
            <p class="text-sm mb-1" :class = GetTextColor(userInfo.level)>{{GetRoleName(userInfo.level)}}</p>
            <p class="text-sm text-gray-600 mb-1">)</p>
          </div>

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
              <div v-if="editMode && isAdmin">
                <el-input
                    v-model="editForm.realName"
                    placeholder="请输入真实姓名"
                    maxlength="10"
                    minlength="2"
                ></el-input>
                <div v-show="editForm.realName.length < 2" class="text-sm text-red-500">姓名长度必须在2-10个字符之间！</div>
              </div>
              <div v-else>
                <p class="font-medium">{{ userInfo.realName }}</p>
              </div>
            </div>
            <div>
              <p class="text-sm text-gray-600">年级</p>
              <div v-if="editMode && isAdmin">
                <el-input-number
                    v-model="editForm.grade"
                    :min="20"
                    :max="99"
                    controls-position="right"
                    size="large"
                    placeholder="请输入年级(例如:23)"
                />
              </div>
              <div v-else>
                <p class="font-medium">{{ userInfo.grade }}</p>
              </div>
            </div>
            <div>
              <p class="text-sm text-gray-600">学号</p>
              <div v-if="editMode && isAdmin">
                <el-input
                    v-model="editForm.studentId"
                    placeholder="请输入真实姓名"
                    maxlength="20"
                    minlength="0"
                ></el-input>
              </div>
              <div v-else>
                <p class="font-medium">{{ userInfo.studentId }}</p>
              </div>
            </div>
            <div v-if="isSuperAdmin && editMode">
              <p class="text-sm text-gray-600">用户身份</p>
              <el-select
                  v-model="editForm.role"
                  placeholder="Select"
                  size="large"
                  style="width: 240px"
              >
                <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <div class="flex flex-col space-y-4">
            <div>
              <p class="text-sm text-gray-600">Codeforces ID</p>
              <div v-if="editMode">
                <el-input
                    v-model="editForm.codeforcesId"
                    placeholder="请输入你的Codeforces ID"
                    maxlength="30"
                    minlength="0"
                ></el-input>
              </div>
              <div v-else>
                <a
                    :href="`https://codeforces.com/profile/${userInfo.codeforcesId}`"
                    target="_blank"
                    class="font-medium text-blue-600 hover:underline cursor-pointer"
                >{{ userInfo.codeforcesId }}</a>
              </div>
            </div>
            <div>
              <p class="text-sm text-gray-600">Codeforces Rating</p>
              <p class="font-medium" :class="getRatingColorClass()">
                {{ userInfo.codeforcesRating }}
              </p>
            </div>
          </div>
        </div>

        <!-- 获奖经历 -->
        <div v-if="editMode || userInfo.awards.length > 0" class="mt-6 pt-6 border-t-2 border-gray-200">
          <div class="flex justify-between items-center mb-6">
            <p class="text-lg font-semibold text-gray-800">🏆 获奖经历</p>
            <el-button 
                v-if="editMode" 
                type="primary" 
                size="small" 
                @click="addAward"
                plain
            >
              <i class="fas fa-plus mr-1"></i> 添加奖项
            </el-button>
          </div>
          
          <!-- 编辑模式 -->
          <div v-if="editMode && editForm.awards.length > 0" class="space-y-3">
            <div 
                v-for="(award, index) in editForm.awards" 
                :key="index"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200"
            >
              <el-input
                  v-model="award.name"
                  placeholder="奖项名称"
                  class="flex-1"
                  maxlength="50"
              ></el-input>
              <el-select
                  v-model="award.level"
                  placeholder="等级"
                  style="width: 120px"
              >
                <el-option label="一等奖/金奖" :value="1"></el-option>
                <el-option label="二等奖/银奖" :value="2"></el-option>
                <el-option label="三等奖/铜奖" :value="3"></el-option>
              </el-select>
              <el-button 
                  type="danger" 
                  size="small" 
                  circle
                  @click="removeAward(index)"
              >
                <i class="fas fa-trash"></i>
              </el-button>
            </div>
          </div>
          
          <!-- 显示模式 - 时间线样式 -->
          <div v-else-if="!editMode && userInfo.awards.length > 0" class="relative pl-6">
            <div 
                v-for="(award, index) in userInfo.awards" 
                :key="index"
                class="relative pb-4 last:pb-0"
            >
              <!-- 连接线 -->
              <div 
                  v-if="index < userInfo.awards.length - 1"
                  class="absolute left-0 top-4 w-0.5 h-full -ml-3"
                  :class="getAwardLineColor(award.level)"
              ></div>
              
              <!-- 圆点 -->
              <div 
                  class="absolute left-0 top-0.5 w-5 h-5 -ml-5 rounded-full shadow-md transition-transform duration-300 hover:scale-125"
                  :class="getAwardCircleClass(award.level)"
              >
              </div>
              
              <!-- 奖项内容 -->
              <div class="ml-2 transition-all duration-300 hover:translate-x-1">
                <p class="font-medium text-gray-800 text-base">

                  <span class="mr-1" :class="getAwardTextColor(award.level)">{{ award.name }}</span>
                  <span class="mr-1">{{ getAwardIcon(award.level) }}</span>
                </p>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-else-if="!editMode" class="text-center text-gray-400 py-8">
            <i class="fas fa-trophy text-4xl mb-2"></i>
            <p>暂无获奖记录</p>
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
              @click="SelectionTab(tab.id)"
              :class="[
              'px-6 py-3 font-medium cursor-pointer whitespace-nowrap',
              activeTab === tab.id ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- 帖子列表 -->
      <div class="flex flex-col gap-3">
        <div
            v-for="(post, index) in Posts"
            :key="index"
            class="animation-delay bg-white border-2 border-gray-800 rounded-lg p-2 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
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
                class="w-48 h-48 rounded-full overflow-hidden border-2 border-gray-800 mb-2 relative group"
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
                type="button"
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
import {get_user_info, get_user_profile, set_profile, set_role, Award} from "@/api/user";
import {useRoute} from "vue-router";
import {CheckLevel, GetTextColor, GetBgColor, GetRoleName, NextLevelLimit} from "@/utils/level";
import {useUserStore} from "@/store/user";

// 使用信息框
import { useMessage } from '@/store/message'
import router from "@/router";
import {upload_image} from "@/api/file";
import {refreshToken} from "@/api/auth";
import {get_like_post, get_page_post, search_post} from "@/api/post";
import {TimestampFormat} from "@/utils/week";
import {PostTypeToColor, PostTypeToName} from "@/utils/post";
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
  nextLevelXp : 0,
  signature: "",
  awards: [] as Award[]
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
  // 个性签名
  userInfo.value.signature = data.data.data.signature;
  // 获奖经历（自动排序：一等奖 > 二等奖 > 三等奖）
  userInfo.value.awards = (data.data.data.awards || []).sort((a: Award, b: Award) => a.level - b.level);

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

const editMode = ref(false)

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

const isAdmin = computed(() => {
  if (UserStore.isLogin()) {
    if (UserStore.getUserInfo().role >= 3) {
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
  { id: "diary", name: "打卡周记" },
  { id: "post", name: "帖子" },
];
const activeTab = ref("diary");

const SelectionTab = (id : string) => {
    activeTab.value = id;
    currentPage.value = 1;
    LoadPosts();
}


// 分页相关
const currentPage = ref(1);
const postsPerPage = ref(3);
const totalPages = ref(1);

const IsLoading = ref(false);
const Posts = ref<any[]>([]);

const PostMAP = new Map<string,boolean>();

onMounted(async () => {
  await LoadPosts();
})


// 加载帖子列表
const LoadTime = ref(0);
const LoadPosts = async () => {
  Posts.value = [];
  LoadTime.value = new Date().getTime();
  const NowLoadTime = LoadTime.value;

  let data;
  data = await get_page_post({
    type: activeTab.value,
    source: "",
    page : currentPage.value,
    by : "user",
    user_id : String(route.params.id),
    count : postsPerPage.value,
  })
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

// 处理分页
const handlePageChange = (val: number) => {
  currentPage.value = val;
  Posts.value = []; // 清空帖子列表
  LoadPosts(); // 重新加载帖子列表
  console.log("当前页码:", currentPage.value);
};

const navigateTo = (url : string) => {
  router.push(url);
};

// 跳转到帖子详情页面
const navigateToPost = (id : string) => {
  router.push('/learn/'+id);
};


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
  signature: "",
  awards: [] as Award[]
});

const openEditMode = () => {
  editForm.value = { 
    ...userInfo.value,
    awards: JSON.parse(JSON.stringify(userInfo.value.awards)) // Deep copy awards array
  };
  editMode.value = true;
}

// 打开编辑弹窗
const openEditModal = () => {
  editForm.value = { 
    ...userInfo.value,
    awards: JSON.parse(JSON.stringify(userInfo.value.awards)) // Deep copy awards array
  };
  showEditModal.value = true;
};

// 关闭编辑弹窗
const closeEditModal = () => {
  showEditModal.value = false;
};

// 保存用户信息
const saveUserInfo = async () => {
  console.log("保存用户信息");
  // 修改 role
  if (userInfo.value.role != editForm.value.role) {
    const data2 = await set_role({id: String(route.params.id), role: editForm.value.role});
    console.log("修改权限请求:",data2);
  }
  // 对奖项进行排序后再保存
  const sortedAwards = [...editForm.value.awards].sort((a, b) => a.level - b.level);
  // 修改用户信息
  const data = await set_profile({
    id : String(route.params.id),
    username: editForm.value.username,
    avatar: editForm.value.avatarUrl,
    real_name: editForm.value.realName,
    grade: editForm.value.grade,
    student_no: editForm.value.studentId,
    codeforces_id: editForm.value.codeforcesId,
    signature: editForm.value.signature,
    awards: sortedAwards,
  })
  console.log(data.data);
  if (data.data.code != 20000) {
    addMessage(data.data.message || '保存失败', 'error')
    return;
  }
  addMessage('保存成功','success')

  console.log("修改用户请求:",data);
  editMode.value = false;
  // 刷新token
  await refreshToken()

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
const limitNumberLength = (event: any) => {
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

const roleOptions = [
    { value: 0, label: "普通用户" },
    { value: 1, label: "普通成员" },
    { value: 2, label: "正式成员" },
    { value: 3, label: "管理员" },
    { value: 4, label: "超级管理员" }
]

// 获奖相关函数
const addAward = () => {
  editForm.value.awards.push({
    name: "",
    level: 1
  });
};

const removeAward = (index: number) => {
  editForm.value.awards.splice(index, 1);
};

const getAwardIcon = (level: number) => {
  switch(level) {
    case 1: return "🥇";
    case 2: return "🥈";
    case 3: return "🥉";
    default: return "🏅";
  }
};

// 时间线样式相关函数
const getAwardCircleClass = (level: number) => {
  switch(level) {
    case 1: return "bg-gradient-to-br from-yellow-300 to-yellow-500";
    case 2: return "bg-gradient-to-br from-gray-300 to-gray-400";
    case 3: return "bg-gradient-to-br from-orange-300 to-orange-400";
    default: return "bg-gray-300";
  }
};

const getAwardLineColor = (level: number) => {
  switch(level) {
    case 1: return "bg-yellow-400";
    case 2: return "bg-gray-400";
    case 3: return "bg-orange-400";
    default: return "bg-gray-300";
  }
};

const getAwardTextColor = (level: number) => {
  switch(level) {
    case 1: return "text-yellow-600";
    case 2: return "text-gray-600";
    case 3: return "text-orange-600";
    default: return "text-gray-500";
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
