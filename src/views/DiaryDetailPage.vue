<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-white text-black">
    <Header/>
    <div class="max-w-3xl mx-auto px-4 py-8 mt-16">
      <!-- 帖子区域 -->
      <div class="bg-white rounded-lg shadow-sm border-2 border-gray-300 mb-8">
        <!-- 作者信息 -->
        <div class="flex items-center p-6 border-b border-gray-100">
          <img
              :src="post.author.avatar"
              alt="作者头像"
              class="w-12 h-12 rounded-full object-cover"
          />
          <div class="ml-4">
            <h3 class="font-bold text-lg">{{ post.author.name }}</h3>
            <p class="text-gray-500 text-sm">{{ post.publishDate }}</p>
          </div>
        </div>

        <!-- 帖子内容 -->
        <div class="p-6">
          <h1 class="text-2xl font-bold mb-10">{{ post.title }}</h1>
          <div class="prose max-w-none -m-8">
            <v-md-preview :text="post.content"></v-md-preview>
          </div>
        </div>

        <!-- 点赞区域 -->
        <div class="px-6 pb-6 flex items-center">
          <button
              @click="toggleLike(post)"
              class="flex items-center cursor-pointer !rounded-button whitespace-nowrap"
              :class="{ 'text-red-500': post.isLiked, 'text-gray-500': !post.isLiked }"
          >
            <i class="fa-heart" :class="post.isLiked ? 'fas' : 'far'"></i>
            <span class="ml-2">{{ post.likes }}</span>
          </button>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold">
            评论 <span class="text-gray-500">({{ comments.length }})</span>
          </h2>
        </div>

        <!-- 添加评论 -->
        <div>
          <div class="mb-3 border-2 border-gray-300 shadow-none">
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
          <div v-for="(comment, index) in comments" :key="index" class="p-6 border-2 border-gray-300 mt-2 rounded-md">
            <div class="flex items-start">
              <img
                  :src="comment.author.avatar"
                  alt="评论者头像"
                  class="w-10 h-10 rounded-full object-cover"
              />
              <div class="ml-4 flex-1">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="font-bold">{{ comment.author.name }}</h4>
                  <span class="text-gray-500 text-sm"
                  >{{ comment.publishDate }}</span
                  >
                </div>
                <p class="text-gray-800 mb-3">{{ comment.content }}</p>
                <button
                    @click="toggleCommentLike(comment)"
                    class="flex items-center text-sm cursor-pointer !rounded-button whitespace-nowrap"
                    :class="{ 'text-red-500': comment.isLiked, 'text-gray-500': !comment.isLiked }"
                >
                  <i
                      class="fa-heart"
                      :class="comment.isLiked ? 'fas' : 'far'"
                  ></i>
                  <span class="ml-1">{{ comment.likes }}</span>
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
import { ref } from "vue";
import Header from "@/components/Header.vue";

interface Author {
  name: string;
  avatar: string;
}

interface Post {
  author: Author;
  title: string;
  content: string;
  publishDate: string;
  likes: number;
  isLiked: boolean;
}

interface Comment {
  author: Author;
  content: string;
  publishDate: string;
  likes: number;
  isLiked: boolean;
}

// 当前用户信息
const currentUser = {
  name: "当前用户",
  avatar:
      "https://public.readdy.ai/ai/img_res/fd5a6e9230c4dc230d6cad7246a0f53f.jpg",
};

// 帖子数据
const post = ref<Post>({
  author: {
    name: "张明",
    avatar:
        "https://public.readdy.ai/ai/img_res/db9b9cd53e01df551a9d55e7135f6f38.jpg",
  },
  title: "黑白摄影的艺术与表现力",
  content:
      "内容测试 $a$ \n $$\\frac{1}{2}$$ \n ```cpp\n #include <iostream>\n int main() {\n  std::cout << \"Hello, world!\" << std::endl;\n  return 0;\n }\n ```\n",
  publishDate: "2025年4月9日 14:30",
  likes: 42,
  isLiked: false,
});

// 评论数据
const comments = ref<Comment[]>([
  {
    author: {
      name: "李华",
      avatar:
          "https://public.readdy.ai/ai/img_res/84b3facbcacf49f34b740fa51e2e8e35.jpg",
    },
    content:
        "非常赞同作者的观点！黑白摄影确实能够让人更加专注于画面本身的构图和情感表达，而不是被色彩所分散注意力。我最近也在尝试黑白风格的创作，感觉收获很多。",
    publishDate: "2025年4月9日 15:20",
    likes: 15,
    isLiked: true,
  },
  {
    author: {
      name: "王芳",
      avatar:
          "https://public.readdy.ai/ai/img_res/d037496b2132028afd4f900270a3a8a5.jpg",
    },
    content:
        "作为一名摄影爱好者，我一直对黑白摄影情有独钟。文章中提到的光影层次感的营造确实是黑白摄影的精髓所在，这需要长期的实践和积累。希望作者能分享一些具体的拍摄技巧和后期处理方法。",
    publishDate: "2025年4月9日 16:45",
    likes: 8,
    isLiked: false,
  },
  {
    author: {
      name: "陈强",
      avatar:
          "https://public.readdy.ai/ai/img_res/e08edcb86c4df92d74863cc0712cc9ee.jpg",
    },
    content:
        "黑白摄影确实有一种独特的魅力，但我认为色彩在某些场景下也是不可或缺的表现元素。两种风格各有千秋，关键在于摄影师如何根据创作意图选择合适的表现形式。期待看到更多关于摄影技巧的分享！",
    publishDate: "2025年4月9日 18:10",
    likes: 5,
    isLiked: false,
  },
]);

// 新评论内容
const newComment = ref("");

// 点赞帖子
const toggleLike = (post: Post) => {
  if (post.isLiked) {
    post.likes -= 1;
  } else {
    post.likes += 1;
  }
  post.isLiked = !post.isLiked;
};

// 点赞评论
const toggleCommentLike = (comment: Comment) => {
  if (comment.isLiked) {
    comment.likes -= 1;
  } else {
    comment.likes += 1;
  }
  comment.isLiked = !comment.isLiked;
};

// 添加评论
const addComment = () => {
  if (newComment.value.trim()) {
    const comment: Comment = {
      author: currentUser,
      content: newComment.value,
      publishDate: "刚刚",
      likes: 0,
      isLiked: false,
    };
    comments.value.unshift(comment);
    newComment.value = "";
  }
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
