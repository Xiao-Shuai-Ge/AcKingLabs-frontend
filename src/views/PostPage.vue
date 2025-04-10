<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-white text-black">
    <Header/>
    <div class="max-w-3xl mx-auto px-4 py-8 mt-16">
      <!-- 作者信息 -->
      <div class="border-2 border-gray-800 rounded-lg inline-block mb-2 pr-5">
        <div class="flex items-center p-3 border-b border-gray-100">
          <img
              :src="AuthorAvatar"
              alt="作者头像"
              class="w-8 h-8 rounded-full object-cover"
          />
          <div class="ml-2">
            <h3 class="font-bold text-base">{{ AuthorName }}</h3>
            <p class="text-gray-500 text-sm">{{ PublishDate }}</p>
          </div>
        </div>
      </div>
      <!-- 帖子区域 -->
      <div class="bg-white rounded-lg shadow-sm border-2 border-gray-800 mb-8">

        <h1 class="text-3xl font-bold m-6">{{ Title }}</h1>

        <hr class="border-1 border-gray-800 mb-3" />
        <!-- 帖子内容 -->
        <div class="p-6">

          <div class="prose max-w-none -m-8">
            <v-md-preview :text="Content"></v-md-preview>
          </div>
        </div>

        <!-- 点赞区域 -->
        <div class="px-6 pb-6 flex items-center">
          <button
              @click="ClickLike"
              class="flex items-center cursor-pointer !rounded-button whitespace-nowrap"
              :class="{ 'text-red-500': IsLiked, 'text-gray-500': !IsLiked }"
          >
            <i class="fa-heart" :class="IsLiked ? 'fas' : 'far'"></i>
            <span class="ml-2">{{ Likes }}</span>
          </button>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold">
            评论 <span class="text-gray-500">({{ Comments }})</span>
          </h2>
        </div>

        <!-- 添加评论 -->
        <div>
          <div class="mb-3 border-2 border-gray-800 shadow-none">
            <v-md-editor
                v-model="newComment"
                height="200px"
                left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code"
            />
          </div>
          <div class="mb-16">
            <button class="w-20 h-8 rounded-md float-right bg-blue-500 text-white hover:bg-blue-400 cursor-pointer">
              发布评论
            </button>
            <span class="text-gray-500 mt-1 mr-5 text-base float-right"> {{ newComment.length }} / 200</span>
          </div>
        </div>

        <!-- 评论列表 -->
        <div>
          <div v-for="(comment, index) in Comments" :key="index" class="p-6 border-2 border-gray-300 mt-2 rounded-md">
            <div class="flex items-start">
              <img
                  :src="comment.AuthorAvatar"
                  alt="评论者头像"
                  class="w-10 h-10 rounded-full object-cover"
              />
              <div class="ml-4 flex-1">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="font-bold">{{ comment.AuthorName }}</h4>
                  <span class="text-gray-500 text-sm"
                  >{{ comment.PublishDate }}</span
                  >
                </div>
                <p class="text-gray-800 mb-3">{{ comment.Content }}</p>
                <button
                    @click="ClickCommentLike()"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import Header from "@/components/Header.vue";
import {get_user_info} from "@/api/user";
import {get_like_post, get_post_detail, like_post} from "@/api/post";
import {useRoute} from "vue-router";

let UserMap = new Map();

// 用户信息缓存--------------------------------------------------------
interface UserInfo {
  username: string;
  avatar: string;
  role : number;
  xp : number;
}

const getUserInfo = async (id : string) : Promise<UserInfo> => {
  let data = UserMap.get(id)
  if (!data) {
    // 不存在，异步请求用户信息
    const resp = await get_user_info({id:id})
    data = resp.data.data
    UserMap.set(id, data)
  }
  console.log(data)
  return data
}
//-------------------------------------------------------------------

const AuthorID = ref("")
const AuthorName = ref("");
const AuthorAvatar = ref("");
const PublishDate = ref("");

const Title = ref("");
const Content = ref("");
const Likes = ref(0);

const IsLiked = ref(false);

const route = useRoute()

onMounted(async () => {
  // 获取帖子信息
  const data = await get_post_detail({id: String(route.params.id)});
  AuthorID.value = data.data.data.user_id;
  Title.value = data.data.data.title;
  Content.value = data.data.data.content;
  Likes.value = data.data.data.likes;

  // 获取作者信息
  const Author = await getUserInfo(AuthorID.value);
  console.log(Author);
  AuthorName.value = Author.username;
  AuthorAvatar.value = Author.avatar;

  // 点赞信息
  const like_resp = await get_like_post({post_id: String(route.params.id)});
  //console.log(like_resp);
  IsLiked.value = like_resp.data.data.is_like;
})

interface comment {
  AuthorName: string;
  AuthorAvatar: string;
  PublishDate: string;

  Content: string;
  Likes: number;

  IsLiked: boolean;
}

// 评论数据
const Comments = ref<comment[]>()

// 新评论内容
const newComment = ref("");

// 点赞帖子
const ClickLike = () => {
  // 先更新本地显示，不然看着别扭
  if (IsLiked.value) {
    IsLiked.value = false;
    Likes.value--;
  } else {
    IsLiked.value = true;
    Likes.value++;
  }
  // 发送点赞请求
  const data = like_post({post_id: String(route.params.id)});
  //console.log(data)
};

// 点赞评论
const ClickCommentLike = () => {

};

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

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
