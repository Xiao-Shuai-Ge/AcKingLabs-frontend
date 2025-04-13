<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-white text-black">
    <Header/>
    <div class="max-w-3xl mx-auto px-4 py-8 mt-16">
      <!-- 作者信息 -->
      <div class="inline-block mb-2">
        <div class="flex items-center gap-2">
          <div class="flex items-center p-3 pr-5 border-2 border-gray-800 rounded-lg h-14 cursor-pointer hover:bg-gray-100"
               @click="navigateToProfile(AuthorID)"
          >
            <img
                :src="AuthorAvatar"
                alt="作者头像"
                class="w-8 h-8 rounded-full object-cover"
            />
            <div class="ml-2">
              <h3
                  class="font-bold text-base"
                  :class = GetTextColor(AuthorLevel)
              >{{ AuthorName }}</h3>
            </div>
          </div>

          <button
              v-if="CanEdit"
              @click="navigateToEditPage"
              class="flex items-center p-3 border-2 border-gray-800 rounded-lg h-14 bg-blue-500 text-white hover:bg-blue-400"
          >
            编辑
          </button>

          <button
              v-if="CanSetFeatured"
              @click="SetFeatured"
              class="flex items-center p-3 border-2 border-gray-800 rounded-lg h-14 bg-yellow-400 text-white hover:bg-yellow-300"
          >
            设为精华
          </button>
        </div>
      </div>
      <!-- 帖子区域 -->
      <div class="bg-white rounded-lg shadow-sm border-2 border-gray-800 mb-8">
        <div class="m-6 mb-4 flex items-center gap-3">
          <span class="text-3xl font-bold"> {{ Title }} </span>
          <span class="text-gray-500 border-2 border-gray-500 rounded-md px-1 text-sm"> {{TypeName}} </span>
          <span v-if="IsPrivate" class="text-blue-500 border-2 border-blue-500 rounded-md px-1 text-sm">私密</span>
          <span v-if="IsFeatured" class="text-yellow-500 border-2 border-yellow-500 rounded-md px-1 text-sm">精华</span>
          <span v-if="IsAdminLike" class="text-red-500 border-2 border-red-500 rounded-md px-1 text-sm">管理推荐</span>
        </div>


        <hr class="border-1 border-gray-800 mb-3" />
        <!-- 帖子内容 -->
        <div class="p-6">

          <div class="prose max-w-none -m-8">
            <v-md-preview :text="Content"></v-md-preview>
          </div>
        </div>

        <hr class="border-1 border-gray-800 mb-3" />
        <!-- 点赞区域 -->
        <div class="px-6 pb-6 flex items-center">
          <button
              @click="ClickLike"
              :disabled="LikedDisabled"
              class="flex items-center cursor-pointer !rounded-button whitespace-nowrap"
              :class="{ 'text-red-500': IsLiked, 'text-gray-500': !IsLiked }"
          >
            <i class="fa-heart" :class="IsLiked ? 'fas' : 'far'"></i>
            <span class="ml-2">{{ Likes }}</span>
          </button>
          <p class="text-gray-500 text-sm ml-auto">{{ PublishDate }}</p>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="mb-64">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold">
            评论 <span class="text-gray-500">({{ CommentCount }})</span>
          </h2>
        </div>

        <!-- 添加评论 -->
        <div>
          <div class="mb-3 border-2 border-gray-800 shadow-none">
            <v-md-editor
                v-model="newComment"
                height="200px"
                disabled-menus = ""
                @upload-image="handleUploadImage"
                left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code"
            />
          </div>
          <div class="mb-16">
            <button
                class="w-20 h-8 rounded-md float-right  text-white"
                @click = "CreateComment"
                :disabled = "CommentDisabled"
                :class = "{
                  'bg-blue-500 hover:bg-blue-400 cursor-pointer': !CommentDisabled,
                  'bg-blue-300 cursor-not-pointer' : CommentDisabled,
                }"
            >
              发布评论
            </button>
            <span class="text-gray-500 mt-1 mr-5 text-base float-right"> {{ newComment.length }} / 1000</span>
          </div>
        </div>

        <div id="targetLocation"></div>

        <!-- 评论列表 -->
        <div>
          <div v-for="(comment, index) in Comments" :key="index" class="p-6 border-2 border-gray-300 mt-2 rounded-md">
            <div class="flex items-start">
              <img
                  :src="comment.AuthorAvatar"
                  alt="评论者头像"
                  class="w-10 h-10 rounded-full object-cover cursor-pointer hover:scale-105 duration-300"
                  @click="navigateToProfile(comment.AuthorID)"
              />
              <div class="ml-4 flex-1">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="font-bold" :class="GetTextColor(comment.AuthorLevel)">{{ comment.AuthorName }}</h4>
                  <span class="text-gray-500 text-sm"
                  >{{ comment.PublishDate }}</span
                  >
                </div>
                <div class="-m-8 -mt-4">
                  <v-md-preview :text="comment.Content"></v-md-preview>
                </div>

<!--                <p class="text-gray-800 mb-3">{{ comment.Content }}</p>-->
                <button
                    @click="ClickCommentLike(comment)"
                    :disabled="comment.LikedDisabled"
                    class="flex items-center text-sm cursor-pointer !rounded-button whitespace-nowrap"
                    :class="{ 'text-red-500': comment.IsLiked, 'text-gray-500': !comment.IsLiked }"
                >
                  <i
                      class="fa-heart"
                      :class="comment.IsLiked ? 'fas' : 'far'"
                  ></i>
                  <span class="ml-1">{{ comment.Likes }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多按钮 -->
        <div class="flex justify-center mt-8" v-if="HasMoreComments">
          <button
              class="px-6 py-3 border-2 border-gray-800 text-gray-800 rounded-md font-medium hover:bg-gray-100 transition-all duration-300 flex items-center cursor-pointer !rounded-button whitespace-nowrap"
              @click="LoadMoreComments(5)"
              :disabled="IsLoading"
          >
            <span v-if="!IsLoading">加载更多</span>
            <i v-else class="fas fa-spinner fa-spin mr-2"></i>
            <span v-if="IsLoading">加载中...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import Header from "@/components/Header.vue";
import {get_user_info} from "@/api/user";
import {
  create_comment,
  get_like_comment,
  get_like_post,
  get_more_comment,
  get_post_detail, get_post_detail_visitor, like_comment,
  like_post, set_featured
} from "@/api/post";
import {useRoute} from "vue-router";
import {PostTypeToName} from "@/utils/post";
import {useUserStore} from "@/store/user";
import {TimestampFormat} from "@/utils/week";
import {CheckLevel, GetTextColor} from "@/utils/level";

// 使用信息框
import {CodeHandler, useMessage} from '@/store/message'
import router from "@/router";
import {upload_image} from "@/api/file";
const { addMessage } = useMessage()

// 使用图片上传
import {handleUploadImage} from '@/utils/file'

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

const AuthorID = ref("")
const AuthorName = ref("");
const AuthorAvatar = ref("");
const AuthorRole = ref(0);
const AuthorXp = ref(0);
const AuthorLevel = ref(0);

const PublishTime = ref(0);
const PublishDate = ref("");

const Title = ref("");
const Content = ref("");
const Likes = ref(0);
const CommentCount = ref(0);
const Type = ref("")
const TypeName = ref("")

const IsAdminLike = ref(false);
const IsFeatured = ref(false);
const IsPrivate = ref(false);

const IsLiked = ref(false);
const LikedDisabled = ref(false);

const CanEdit = computed(() => {
  if (UserStore.getUserInfo().user_id == AuthorID.value || UserStore.getUserInfo().role >= 3) {
    return true
  }
  return false
});
const CanSetFeatured = computed(() => {
  if (UserStore.getUserInfo().role >= 3 && IsFeatured.value == false) {
    return true;
  }
  return false
});

const SetFeatured = async () => {
  const data = await set_featured({post_id: String(route.params.id)})
  console.log(data)
  if (data.data.code != 20000) {
    addMessage("设置精华失败","error")
    return
  }
  addMessage("设置精华成功","success")
  IsFeatured.value = true;
}

const UserStore = useUserStore();
const route = useRoute()

onMounted(async () => {
  // 获取帖子信息
  let data;
  if (UserStore.isLogin()) {
    data = await get_post_detail({id: String(route.params.id)});
  } else {
    data = await get_post_detail_visitor({id: String(route.params.id)});
  }
  console.log(data);
  if (data.data.code != 20000) {
    addMessage("查看帖子失败","error")
    await router.push("/diary");
    return
  }

  AuthorID.value = data.data.data.user_id;
  Title.value = data.data.data.title;
  Content.value = data.data.data.content;
  Likes.value = data.data.data.likes;
  CommentCount.value = data.data.data.comments;
  IsPrivate.value = data.data.data.is_private;
  IsAdminLike.value = data.data.data.is_admin_like;
  IsFeatured.value = data.data.data.is_featured;
  Type.value = data.data.data.type;
  TypeName.value = PostTypeToName(Type.value);
  PublishTime.value = data.data.data.created_at;
  console.log(PublishTime.value)
  PublishDate.value = TimestampFormat(new Date(PublishTime.value));

  // 获取作者信息
  const Author = await getUserInfo(AuthorID.value);
  console.log(Author);
  AuthorName.value = Author.username;
  AuthorAvatar.value = Author.avatar;
  AuthorXp.value = Author.xp;
  AuthorRole.value = Author.role;
  AuthorLevel.value = CheckLevel(AuthorXp.value,AuthorRole.value);

  // 点赞信息
  const like_resp = await get_like_post({post_id: String(route.params.id)});
  console.log(like_resp);
  IsLiked.value = like_resp.data.data.is_like;

  // 刷新评论
  LoadMoreComments(10);
})

interface comment {
  ID : string;
  AuthorID : string;
  AuthorName: string;
  AuthorAvatar: string;
  AuthorXp : number;
  AuthorLevel : number;

  PublishTime : number;
  PublishDate: string;

  Content: string;
  Likes: number;

  IsLiked: boolean;
  LikedDisabled : boolean;
}

const CommentDisabled = computed(() => {
  if (newComment.value.length > 1000 || newComment.value.trim() === "") {
    return true;
  }
  return false;
})

// 评论数据
const Comments = ref<comment[]>([])

// 新评论内容
const newComment = ref("");

// 点赞帖子
const ClickLike = async () => {
  LikedDisabled.value = true;
  setTimeout(() => {
    LikedDisabled.value = false;
  },300)
  // 发送点赞请求
  const data = await like_post({post_id: String(route.params.id)});
  console.log(data)
  if (data.data.code != 20000) {
    addMessage('点赞失败', 'error')
    return
  }
  if (IsLiked.value) {
    IsLiked.value = false;
    Likes.value--;
  } else {
    IsLiked.value = true;
    Likes.value++;
  }
  console.log(data)
};

const HasMoreComments = ref(true);
const IsLoading = ref(false);
const BeforeID = ref("9223372036854775807");

const CommentMAP = new Map<string,boolean>();

const LoadMoreComments = async (count : number) => {
  IsLoading.value = true;
  const data = await get_more_comment({
    post_id: String(route.params.id),
    before_id: BeforeID.value,
    count: count
  });
  console.log(data);
  if (data.data.data.length > 0) {
    // 循环加入评论列表
    for (const comment of data.data.data.comments) {
      if (!CommentMAP.has(comment.id)) {
        CommentMAP.set(comment.id, true);
        const Author = await getUserInfo(comment.user_id);
        const isLiked = await get_like_comment({comment_id: comment.id});
        console.log(isLiked);
        Comments.value.push({
          ID : comment.id,
          AuthorID: comment.user_id,
          AuthorName: Author.username,
          AuthorAvatar: Author.avatar,
          AuthorXp: Author.xp,
          AuthorLevel: Author.level,
          PublishTime: comment.created_at,
          PublishDate: TimestampFormat(new Date(comment.created_at)),
          Content: comment.content,
          Likes: comment.likes,
          IsLiked: isLiked.data.data.is_like,
          LikedDisabled: false,
        });
        BeforeID.value = comment.id
      }
    }
  }
  IsLoading.value = false;
  if (data.data.data.length < count ) {
    HasMoreComments.value = false;
  }
}

const CreateComment = async () => {
  const data = await create_comment({
    post_id: String(route.params.id),
    content: newComment.value,
  })
  if (data.data.code != 20000) {
    addMessage('发送失败', 'error')
    return
  }
  newComment.value = "";
  // 刷新评论
  HasMoreComments.value = true;
  Comments.value=[];
  CommentMAP.clear();
  BeforeID.value = "9223372036854775807";
  await LoadMoreComments(10);
}

// 点赞评论
const ClickCommentLike = async (selectComment : comment) => {
  selectComment.LikedDisabled = true;
  setTimeout(() => {
    selectComment.LikedDisabled = false;
  },300)
  const data = await like_comment({comment_id: selectComment.ID});
  if (data.data.code != 20000) {
    addMessage('点赞失败', 'error')
    return
  }
  if (selectComment.IsLiked) {
    selectComment.IsLiked = false;
    selectComment.Likes--;
  } else {
    selectComment.IsLiked = true;
    selectComment.Likes++;
  }
};



// 跳转到用户主页
const navigateToProfile = (id : string) => {
  router.push('/profile/'+id);
};

const navigateToEditPage = () => {
  router.push("/diary/"+route.params.id+"/edit");
}

//测试，循环点赞
// setInterval(async () => {
//   const data = await like_comment({comment_id: "1910348998087020544"});
//   console.log(data);
// }, 100)

// setInterval(async () => {
//   const data = await like_post({post_id: "1910197948357021696"});
//   console.log(data);
// }, 100)


</script>

<style scoped>
.prose p {
  margin-bottom: 1rem;
  text-align: left;
}

textarea {
  resize: vertical;
}

.fa-heart {
  font-size: 1.25rem;
  margin-right: 0.25rem;
}

</style>
