<template>
  <div class="min-h-screen bg-white text-black">
    <Header/>

    <div class="max-w-3xl mx-auto px-4 py-8 mt-16">
      <!-- 列表  -->
      <div
          v-for="(active, index) in actives"
          @click="Signin(active)"
          class="mt-4 cursor-pointer flex items-center border-2 border-gray-800 p-4 rounded-md shadow-lg hover:scale-105 transition-all duration-300"
          :class="active.colorClass"
      >
        {{ active.className }} : {{ active.activeName }}
        <span class="ml-auto text-sm" v-if="active.teacherMode">
          <i class="fa-solid fa-triangle-exclamation"></i>
          警告: 签到已结束，再次点击使用补签，请谨慎操作
        </span>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import Header from "@/components/Header.vue";
import {onMounted, ref} from "vue";
import {signin_list, signin, signin_teacher} from "@/api/test";
import router from "@/router";

// 使用信息框
import { CodeHandler, useMessage} from '@/store/message'
const { addMessage } = useMessage()


interface Active {
  activeName: string;
  className: string;
  userID: number;
  classID: number;
  relationID: number;
  disabled: boolean;
  colorClass: string;
  teacherMode : boolean;
}

const actives = ref<Active[]>([]);

onMounted(async () => {
  // 获取活动列表
  addMessage("加载中...","info")
  const data = await signin_list();
  if (data.data.code != 20000) {
    addMessage("发生错误!","error")
    setTimeout(() => {
      router.push("/");
    },1000)
    return
  }
  console.log("加载成功", data.data.data);
  addMessage("加载成功!","success")
  for (const active of data.data.data.actives) {
    actives.value.push({
      activeName: active.active_name,
      className: active.class_name,
      userID: active.user_id,
      classID: active.class_id,
      relationID: active.relation_id,
      disabled: false,
      colorClass: "bg-white",
      teacherMode: false,
    });
  }
})

const Signin = async (active : Active) => {
  if (active.disabled) {
    addMessage("请等待处理中...","warning")
    return
  }
  addMessage("签到中...","info")
  active.disabled = true
  active.colorClass = "bg-yellow-300"
  let data;
  if (active.teacherMode) {
    data = await signin_teacher({
      relation_id: active.relationID,
      user_id: active.userID,
    })
  } else {
    data = await signin({
      relation_id: active.relationID,
      user_id: active.userID,
      class_id: active.classID,
    })
  }
  console.log("签到结果",data)
  if (data.data.code != 20000) {
    addMessage("签到失败!","error")
    active.colorClass = "bg-red-300"
    active.disabled = false
    active.teacherMode = true
    return
  }
  addMessage("签到成功!","success")
  active.teacherMode = false
  active.colorClass = "bg-green-300"
}

</script>