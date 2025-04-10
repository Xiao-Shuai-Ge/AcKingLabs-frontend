<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-white text-gray-900 flex flex-col">
    <Header/>

    <main class="flex-grow flex px-6 py-6 mt-12 gap-6 max-w-7xl mx-auto w-full">
      <!-- 左侧编辑区 -->
      <div class="w-7/12 flex flex-col gap-2">
        <div class="flex flex-col gap-2">
          <label for="title" class="text-sm font-medium text-gray-700"
          >标题</label
          >
          <input
              id="title"
              v-model="postTitle"
              type="text"
              placeholder="请输入帖子标题"
              maxlength="50"
              disabled
              class="text-gray-500 h-10 border-gray-300 border rounded-button px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="title" class="text-sm font-medium text-gray-700"
          >时间</label
          >
          <input
              id="title"
              v-model="postSource"
              type="text"
              placeholder=""
              disabled
              maxlength="255"
              class="text-gray-500 h-10 border-gray-300 border rounded-button px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>

        <div class="gap-2">
          <label class="text-sm font-medium text-gray-700 w-1/2 float-left mb-2">类型</label>
          <label class="text-sm font-medium text-gray-700 w-1/2 float-right mb-2">隐私
            <span class="text-xs text-gray-500">(公开双倍经验，私密仅自己和管理可见)</span>
          </label>
          <div class="w-1/3 float-left relative">
            <button
                @click="toggleTypeDropdown"
                class="h-10 w-full flex items-center justify-between border border-gray-300 rounded-button px-2 py-1 cursor-pointer whitespace-nowrap"
                :disabled = "typeDisabled"
                :class = "{
                  'bg-gray-50 text-gray-500' : typeDisabled,
                  'bg-white' : !typeDisabled
                }"
            >
              <span>{{ selectedType || '请选择帖子类型' }}</span>
              <i class="fas fa-chevron-down text-gray-500"></i>
            </button>
            <div
                v-if="showTypeDropdown"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
            >
              <ul>
                <li
                    v-for="type in postTypes"
                    :key="type"
                    @click="selectType(type)"
                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {{ type }}
                </li>
              </ul>
            </div>
          </div>
          <!-- 新增的公开/私密单选 -->
          <div class="w-1/2 float-right">
            <div class="flex h-10 border border-gray-300 rounded-button divide-x divide-gray-300">
              <label
                  v-for="option in privacyOptions"
                  :key="option.value"
                  class="flex-1 flex items-center justify-center gap-2 px-2 cursor-pointer hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-gray-100': option.value === isPrivate }"
              >
                <input
                    type="radio"
                    v-model="isPrivate"
                    :value="option.value"
                    class="hidden"
                >
                <i :class="option.icon"></i>
                <span>{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2 flex-grow">
          <label for="content" class="text-sm font-medium text-gray-700">
            内容
            <span
                class="float-right"
                :class="{
                  'text-red-500': postContent.length === 0 || postContent.length > 5000,
                }"
            >{{ postContent.length }}  / 5000</span>
          </label>
          <div class="shadow-white">
            <v-md-editor
                v-model="postContent"
                mode="edit"
                left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code"
                right-toolbar="toc"
                height="400px"
            ></v-md-editor>
          </div>
        </div>

        <div class="flex gap-4 mt-4 mb-8">
          <button
              @click="publishPost"
              :disabled="saveDisabled"
              class="bg-black text-white px-6 py-3 rounded-button transition-colors whitespace-nowrap"
              :class = "{
                'bg-gray-500 cursor-not-allowed': saveDisabled,
                'bg-black hover:bg-gray-800 cursor-pointer': !saveDisabled,
              }"
          >
            发布帖子
          </button>
          <button
              @click="saveDraft"
              :disabled="saveDisabled"
              class="border border-gray-300 px-6 py-3 rounded-button hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"

          >
            保存草稿
          </button>
        </div>
      </div>

      <!-- 右侧预览区 -->
      <div class="w-5/12 flex flex-col">
        <div
            class="border border-gray-200 rounded-lg shadow-sm bg-gray-50 p-6 h-[80vh] overflow-auto"
        >
          <div class="preview-container">
            <h2 class="text-2xl font-bold mb-4">
              {{ postTitle || '帖子标题预览' }}
            </h2>
            <div class="text-sm text-gray-500 mb-8 flex items-center gap-2">
              <span class="bg-gray-200 px-2 py-1 rounded"
              >{{ selectedType || '未选择类型' }}</span
              >
              <span>{{ currentDate }}</span>
            </div>
            <div class="-m-8">
              <v-md-preview :text="postContent"></v-md-preview>
            </div>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted} from "vue";
import Header from "@/components/Header.vue";
import {getWeekday, GetWeekCode} from "@/utils/week";
import {create_post} from "@/api/post";
import router from "@/router";

// 帖子数据
const postTitle = ref("");
const postContent = ref("");
const postSource = ref("");
const selectedType = ref("周记");
const showTypeDropdown = ref(false);

onMounted(()=>{
  // 自动识别当前是第几周
  let date = new Date(1744541827000);

  postSource.value = GetWeekCode(date).name;
  postTitle.value = GetWeekCode(date).name+" 学习周记"
})

// 新增的隐私选项
const isPrivate = ref(false);
const privacyOptions = ref([
  {
    value: false,
    label: '公开',
    icon: 'fas fa-globe-asia text-gray-600'
  },
  {
    value: true,
    label: '私密',
    icon: 'fas fa-lock text-gray-600'
  }
]);

// 帖子类型列表
const postTypes = [
  "周记",
];

const typesCode : Record<string,string> = {
  "周记" : "diary",
}

// 当前日期
const currentDate = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
});

// 切换类型下拉菜单
const toggleTypeDropdown = () => {
  showTypeDropdown.value = !showTypeDropdown.value;
};

// 选择类型
const selectType = (type: string) => {
  selectedType.value = type;
  showTypeDropdown.value = false;
};

// 默认禁用
const typeDisabled = ref(true);

const saveDisabled = computed(() => {
  console.log("?")
  if (postTitle.value.length == 0 || postSource.value.length == 0 || selectedType.value.length == 0 || postContent.value.length == 0 || postContent.value.length > 5000) {
    return true;
  }
  return false;
})


// 发布帖子
const publishPost = async () => {
  const data = await create_post({
    title: postTitle.value,
    content: postContent.value,
    type : typesCode[selectedType.value],
    source: postSource.value,
    is_private: isPrivate.value,
  })
  console.log(data)
  if (data.data.code != 20000) {
    alert("发布失败，请稍后再试！");
  }
  // 跳转
  await router.push("/diary/" + data.data.data.id)
};

// 保存草稿
const saveDraft = () => {
  alert("草稿已保存到本地！");
  // 这里可以添加实际的保存草稿逻辑
};
</script>

<style scoped>
.preview-content {
  line-height: 1.6;
  color: #333;
}

/* 自定义滚动条样式 */
.preview-container::-webkit-scrollbar {
  width: 8px;
}

.preview-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.preview-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.preview-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 去除 input number 的默认箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
