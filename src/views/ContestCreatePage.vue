<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <div class="max-w-6xl mx-auto py-8 px-6 mt-14">
      <div class="bg-gradient-to-r from-gray-800 to-gray-500 rounded-lg shadow-lg mt-4 flex flex-col p-6">
        <h1 class="text-3xl font-bold mb-4 text-white">创建自定义比赛</h1>
      </div>

      <div class="bg-white rounded-lg shadow-lg mt-4 flex flex-col p-6 space-y-4">
        <div class="flex">
          <h1 class="text-lg font-bold mr-4">标题</h1>
          <el-input v-model="ContestTitle" style="width: 400px" placeholder="请输入比赛标题" />
        </div>
        <div class="flex">
          <h1 class="text-lg font-bold mr-4">时间</h1>
          <div class="demo-datetime-picker">
            <div class="block">
              <el-date-picker
                  v-model="date"
                  type="datetimerange"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  format="YYYY-MM-DD HH:mm:ss"
                  date-format="YYYY/MM/DD ddd"
                  time-format="A hh:mm:ss"
              />
            </div>
          </div>
        </div>
        <div class="flex">
          <h1 class="text-lg font-bold mr-4">网址(必填)</h1>
          <el-input v-model="ContestUrl" style="width: 600px" placeholder="请输入比赛链接" />
        </div>
        <hr>
        <div class="flex">
          <el-button type="primary" @click="createContest()" :disabled="disabledCreate">创建比赛</el-button>
          <el-button type="default" @click="goBack()">返回</el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import {computed, ref} from "vue";
import router from "@/router";
import {create_contest} from "@/api/contest";
import {CodeHandler} from "@/store/message";

const ContestTitle = ref("");
const ContestUrl = ref("");
const date = ref<[Date, Date]>([new Date(), new Date()])

const disabledCreate = computed(() => {
  return ContestTitle.value.trim() === "" || ContestUrl.value.trim() === "" || !date.value;
})

const createContest = async () => {
  console.log(ContestTitle.value, ContestUrl.value, date.value)
  const data = await create_contest({
    title: ContestTitle.value,
    url: ContestUrl.value,
    start_time: date.value[0].getTime(),
    end_time: date.value[1].getTime(),
  })
  console.log(data)
  if (CodeHandler(data.data.code,[
    [20000, "创建成功","success"],
    [60004, "比赛链接已存在","error"],
    [0, "创建失败","error"]]))
  {
    return
  }
}

const goBack = () => {
  router.push("/contest/");
}

</script>

<style scoped>

</style>