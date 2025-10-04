<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Header/>

    <div class="max-w-6xl mx-auto px-6 py-8 mt-14" v-if="!isLoading">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">学习管理</h1>
        <p class="text-gray-600">签到活动与课程管理</p>
      </div>

      <!-- 签到活动部分 -->
      <el-card class="mb-8" shadow="hover">
        <template #header>
          <div class="flex items-center">
            <el-icon class="mr-2 text-blue-600"><Calendar /></el-icon>
            <span class="text-xl font-semibold text-gray-800">签到活动</span>
          </div>
        </template>
        
        <div v-if="actives.length > 0" class="space-y-4">
          <el-card
              v-for="(active, index) in actives"
              :key="index"
              @click="Signin(active)"
              class="cursor-pointer transition-all duration-300 hover:shadow-lg"
              :class="{
                'border-l-4 border-green-500': active.isSignin,
                'border-l-4 border-yellow-500': active.colorClass === 'bg-yellow-100',
                'border-l-4 border-red-500': active.colorClass === 'bg-red-100',
                'border-l-4 border-gray-400': active.isFinished
              }"
              shadow="never"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <el-icon class="mr-2 text-blue-600"><School /></el-icon>
                <span class="font-semibold text-lg text-gray-800">
                  {{ active.className }} - {{ active.activeName }}
                </span>
              </div>
              <el-tag 
                :type="active.isFinished ? 'info' : 'success'"
                size="small"
              >
                {{ active.isFinished ? '已结束' : '进行中' }}
              </el-tag>
            </div>
            
            <div v-if="!active.isSignin" class="space-y-3">
              <div class="flex items-center text-sm text-gray-600">
                <el-icon class="mr-1"><User /></el-icon>
                <span class="mr-2">签到人数:</span>
                <span :class="active.percentage >= 20 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                  {{ active.absenceNum }}
                </span>
                <span class="text-gray-500">/ {{ active.notAbsenceNum + active.absenceNum }}</span>
              </div>
              
              <div class="space-y-2">
                <div class="flex justify-between text-sm text-gray-600">
                  <span>签到进度</span>
                  <span class="font-semibold">{{ active.percentage.toFixed(1) }}%</span>
                </div>
                <el-progress
                    :percentage="active.percentage"
                    :stroke-width="8"
                    :color="active.percentage >= 20 ? '#67c23a' : '#f56c6c'"
                    :show-text="false"
                />
              </div>
            </div>
            
            <div v-else class="text-center py-2">
              <el-icon class="text-green-600 text-2xl"><Check /></el-icon>
              <span class="ml-2 text-green-600 font-semibold">已签到</span>
            </div>
          </el-card>
        </div>
        
        <el-empty v-else description="近期暂无签到活动" :image-size="120">
          <template #image>
            <el-icon size="120" color="#c0c4cc"><Calendar /></el-icon>
          </template>
        </el-empty>
      </el-card>

      <!-- 课程列表部分 -->
      <el-card shadow="hover">
        <template #header>
          <div class="flex items-center">
            <el-icon class="mr-2 text-purple-600"><Reading /></el-icon>
            <span class="text-xl font-semibold text-gray-800">课程列表</span>
          </div>
        </template>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <el-card
              v-for="(course, index) in courses"
              :key="index"
              @click="OpenCourseDialog(course)"
              class="cursor-pointer transition-all duration-300 hover:shadow-lg"
              :class="course.isAutoSignin ? 'border-l-4 border-yellow-500 bg-yellow-50' : 'border-l-4 border-blue-500'"
              shadow="never"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <el-icon class="mr-2 text-purple-600"><Reading /></el-icon>
                <span class="font-semibold text-gray-800">{{ course.courseName }}</span>
              </div>
              <el-tag 
                v-if="course.isAutoSignin" 
                type="warning" 
                size="small"
              >
                自动签到
              </el-tag>
            </div>
            <div v-if="course.isAutoSignin" class="mt-2 text-sm text-gray-600">
              <span>触发比例: {{ course.Percent }}%</span>
            </div>
          </el-card>
        </div>
        
        <el-empty v-if="courses.length === 0" description="暂无课程" :image-size="120">
          <template #image>
            <el-icon size="120" color="#c0c4cc"><Reading /></el-icon>
          </template>
        </el-empty>
      </el-card>
    </div>
  </div>
  <el-dialog
      v-model="CourseDialogVisible"
      title="自动签到设置"
      width="500"
      align-center
      :close-on-click-modal="false"
  >
    <div class="space-y-6">
      <div class="text-center">
        <el-icon class="text-4xl text-blue-600 mb-2"><Setting /></el-icon>
        <h3 class="text-lg font-semibold text-gray-800">{{ SelectCourseName }}</h3>
        <p class="text-sm text-gray-600">配置自动签到功能</p>
      </div>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center">
            <el-icon class="mr-2 text-green-600"><Switch /></el-icon>
            <span class="font-medium text-gray-700">开启自动签到</span>
          </div>
          <el-switch
              v-model="IsAutoSignin"
              active-color="#67c23a"
              inactive-color="#dcdfe6"
          />
        </div>
        
        <div v-if="IsAutoSignin" class="p-4 bg-blue-50 rounded-lg">
          <div class="flex items-center mb-3">
            <el-icon class="mr-2 text-blue-600"><TrendCharts /></el-icon>
            <span class="font-medium text-gray-700">触发比例设置</span>
          </div>
          <div class="flex items-center space-x-3">
            <el-input 
                v-model="AutoSigninPercent" 
                placeholder="0-100"
                type="number"
                min="0"
                max="100"
                class="w-32"
            />
            <span class="text-gray-600">%</span>
            <el-tooltip content="当签到人数达到此比例时自动签到" placement="top">
              <el-icon class="text-gray-400 cursor-help"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
          <div class="mt-2">
            <el-slider
                v-model="AutoSigninPercent"
                :min="0"
                :max="100"
                :step="5"
                show-stops
                show-input
                class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="CourseDialogVisible = false" size="large">
          取消
        </el-button>
        <el-button type="primary" @click="SaveCourseSetting()" size="large">
          <el-icon class="mr-1"><Check /></el-icon>
          确认设置
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">
import Header from "@/components/Header.vue";
import {onMounted, ref} from "vue";
import {signin_list, signin, signin_teacher, get_auto_list, save_auto_setting} from "@/api/test";
import router from "@/router";
import { 
  Calendar, 
  School, 
  User, 
  Check, 
  Reading, 
  Setting, 
  Switch, 
  TrendCharts, 
  QuestionFilled 
} from '@element-plus/icons-vue';

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
  absenceNum : number;
  notAbsenceNum: number;
  isFinished: boolean;
  percentage: number;
  isSignin: boolean;
}

interface Course {
  courseName: string;
  courseID: number;
  classID: number;
  isAutoSignin: boolean;
  Percent: number;
}

const actives = ref<Active[]>([]);
const courses = ref<Course[]>([]);
const isLoading = ref(true);
const myLevel = ref(0);

onMounted(async () => {
  isLoading.value = true;
  // 获取活动列表
  addMessage("加载中...","info")
  const data = await signin_list();
  if (data.data.code != 20000) {
    addMessage(data.data.message || "发生错误!","error")
    setTimeout(() => {
      router.push("/");
    },1000)
    return
  }
  console.log("加载成功", data.data.data);
  addMessage("加载成功!","success")
  myLevel.value = data.data.data.level;
  if (data.data.data.length > 0) {
    for (const active of data.data.data.actives) {
      actives.value.push({
        activeName: active.active_name,
        className: active.class_name,
        userID: active.user_id,
        classID: active.class_id,
        relationID: active.relation_id,
        disabled: false,
        colorClass: "bg-white",
        teacherMode: active.is_finished, // 如果已结束则为true
        absenceNum: active.absence_num,
        notAbsenceNum: active.not_absence_num,
        isFinished: active.is_finished,
        percentage: (active.absence_num / (active.absence_num + active.not_absence_num) * 100),
        isSignin: false,
      });
    }
  }
  for (const course of data.data.data.courses) {
    courses.value.push({
      courseName: course.course_name,
      courseID: course.course_id,
      classID: course.class_id,
      isAutoSignin: false,
      Percent: 0,
    });
  }
  // 获取自动签到列表
  const autoIDList = await get_auto_list()
  if (autoIDList.data.data.course_list) {
    for (const auto_course of autoIDList.data.data.course_list) {
      for (const course of courses.value) {
        if (course.courseID == auto_course.course_id) {
          course.isAutoSignin = true
          course.Percent = auto_course.percent
        }
      }
    }
  }
  //console.log("活动列表", courses.value);
  isLoading.value = false;
})

const Signin = async (active : Active) => {
  if (active.disabled) {
    addMessage("请等待处理中...","warning")
    return
  }
  addMessage("签到中...","info")
  active.disabled = true
  active.colorClass = "bg-yellow-100"
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
    addMessage(data.data.message || "签到失败!","error")
    active.colorClass = "bg-red-100"
    active.disabled = false
    active.teacherMode = true
    return
  }
  addMessage("签到成功!","success")
  active.teacherMode = false
  active.isSignin = true
  active.colorClass = "bg-green-100"
  active.absenceNum = active.absenceNum + 1
  active.notAbsenceNum = active.notAbsenceNum - 1
  active.percentage = (active.absenceNum / (active.absenceNum + active.notAbsenceNum) * 100)
}

const CourseDialogVisible = ref(false)

const SelectCourseID = ref(0)
const SelectCourseName = ref("")
const SelectClassID = ref(0)
const IsAutoSignin = ref(false)
const AutoSigninPercent = ref(0)

const OpenCourseDialog = (course : Course) => {
  if ( myLevel.value >= 3 ) {
    SelectCourseID.value = course.courseID
    SelectCourseName.value = course.courseName
    SelectClassID.value = course.classID
    IsAutoSignin.value = course.isAutoSignin
    AutoSigninPercent.value = course.Percent
    CourseDialogVisible.value = true
  }
}

const SaveCourseSetting = async () => {
  const data = await save_auto_setting({
    course_id: SelectCourseID.value,
    course_name: SelectCourseName.value,
    class_id: SelectClassID.value,
    is_auto: IsAutoSignin.value,
    percent: Number(AutoSigninPercent.value),
  })
  if (data.data.code != 20000) {
    addMessage(data.data.message || "设置失败!","error")
    console.log(data.data)
    return
  }
  addMessage("设置成功!","success")
  for (const course of courses.value) {
    if (course.courseID == SelectCourseID.value) {
      course.isAutoSignin = IsAutoSignin.value
      course.Percent = Number(AutoSigninPercent.value)
    }
  }
  CourseDialogVisible.value = false
  // 设置成功后刷新token

}

</script>